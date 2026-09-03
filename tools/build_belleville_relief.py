#!/usr/bin/env python3
"""Build the Belleville console sprite as a watertight voxel-relief STL."""

from __future__ import annotations

import argparse
import math
import struct
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


FACE_DEFS = (
    ((1, 0, 0), ((1, 0, 0), (1, 1, 0), (1, 1, 1), (1, 0, 1))),
    ((-1, 0, 0), ((0, 0, 0), (0, 0, 1), (0, 1, 1), (0, 1, 0))),
    ((0, 1, 0), ((0, 1, 0), (0, 1, 1), (1, 1, 1), (1, 1, 0))),
    ((0, -1, 0), ((0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1))),
    ((0, 0, 1), ((0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1))),
    ((0, 0, -1), ((0, 0, 0), (0, 1, 0), (1, 1, 0), (1, 0, 0))),
)


def relief_depth(x: int, y: int, rgba: np.ndarray) -> int:
    """Assign front-to-back layers while preserving the sprite silhouette."""
    red, green, blue, alpha = (int(value) for value in rgba)
    if alpha < 128:
        return 0

    depth = 3
    # Console body and chair form the rear structural layer.
    if x >= 55:
        depth = 4
    if x <= 38 and y >= 26:
        depth = 5

    # Hair and the seated doll project toward the viewer.
    if 18 <= x <= 48 and y <= 34 and red > green * 1.25:
        depth = 8
    if 25 <= x <= 68 and 25 <= y <= 91:
        warm_skin = red > 170 and green > 65 and blue < 85
        pink_suit = red > 175 and blue > 65 and red > green * 1.35
        if warm_skin:
            depth = max(depth, 8)
        if pink_suit:
            depth = 9

    # Raised screens, buttons, and articulated manipulators read as hardware.
    chroma = max(red, green, blue) - min(red, green, blue)
    if x >= 55 and chroma > 55:
        depth = max(depth, 7)
    if y <= 44 and (red + green + blue) < 210:
        depth = max(depth, 6)

    # Pale one-pixel highlights become a subtle final relief step.
    if red > 235 and green > 225 and blue > 195:
        depth = max(depth, 5)
    return depth


def build_volume(image: Image.Image) -> tuple[np.ndarray, np.ndarray]:
    pixels = np.asarray(image.convert("RGBA")).copy()
    height, width, _ = pixels.shape
    depths = np.zeros((height, width), dtype=np.uint8)
    for y in range(height):
        for x in range(width):
            depths[y, x] = relief_depth(x, y, pixels[y, x])

    # A diagonal pair of pixels would make two voxel columns touch along only
    # one edge, which is non-manifold in STL. Bridge those one-pixel corners so
    # every connected part has a printable, slicer-friendly surface.
    changed = True
    while changed:
        changed = False
        for y in range(height - 1):
            for x in range(width - 1):
                a, b = int(depths[y, x]), int(depths[y, x + 1])
                c, d = int(depths[y + 1, x]), int(depths[y + 1, x + 1])
                if a and d and not b and not c:
                    depths[y, x + 1] = min(a, d)
                    pixels[y, x + 1] = pixels[y, x]
                    changed = True
                elif b and c and not a and not d:
                    depths[y, x] = min(b, c)
                    pixels[y, x] = pixels[y, x + 1]
                    changed = True

    max_depth = int(depths.max())
    volume = np.zeros((height, width, max_depth), dtype=bool)
    for y in range(height):
        for x in range(width):
            volume[y, x, : int(depths[y, x])] = True

    # Depth changes can reintroduce edge-only contacts in XY, XZ, or YZ.
    # Bridge every checkerboard occupancy pattern until the voxel boundary is
    # two-manifold. Only a handful of cells are normally added.
    changed = True
    while changed:
        changed = False
        for z in range(max_depth):
            for y in range(height - 1):
                for x in range(width - 1):
                    a, b = bool(volume[y, x, z]), bool(volume[y, x + 1, z])
                    c, d = bool(volume[y + 1, x, z]), bool(volume[y + 1, x + 1, z])
                    if a and d and not b and not c:
                        volume[y, x + 1, z] = True
                        if pixels[y, x + 1, 3] < 128:
                            pixels[y, x + 1] = pixels[y, x]
                        changed = True
                    elif b and c and not a and not d:
                        volume[y, x, z] = True
                        if pixels[y, x, 3] < 128:
                            pixels[y, x] = pixels[y, x + 1]
                        changed = True

        for y in range(height):
            for z in range(max_depth - 1):
                for x in range(width - 1):
                    a, b = bool(volume[y, x, z]), bool(volume[y, x + 1, z])
                    c, d = bool(volume[y, x, z + 1]), bool(volume[y, x + 1, z + 1])
                    if a and d and not b and not c:
                        volume[y, x + 1, z] = True
                        changed = True
                    elif b and c and not a and not d:
                        volume[y, x, z] = True
                        changed = True

        for x in range(width):
            for z in range(max_depth - 1):
                for y in range(height - 1):
                    a, b = bool(volume[y, x, z]), bool(volume[y + 1, x, z])
                    c, d = bool(volume[y, x, z + 1]), bool(volume[y + 1, x, z + 1])
                    if a and d and not b and not c:
                        volume[y + 1, x, z] = True
                        changed = True
                    elif b and c and not a and not d:
                        volume[y, x, z] = True
                        changed = True
    return volume, pixels


def exposed_faces(volume: np.ndarray, colors: np.ndarray):
    height, width, depth = volume.shape
    for y in range(height):
        for x in range(width):
            for z in range(depth):
                if not volume[y, x, z]:
                    continue
                for normal, corners in FACE_DEFS:
                    nx, ny, nz = x + normal[0], y + normal[1], z + normal[2]
                    if (
                        0 <= nx < width
                        and 0 <= ny < height
                        and 0 <= nz < depth
                        and volume[ny, nx, nz]
                    ):
                        continue
                    vertices = []
                    for cx, cy, cz in corners:
                        vertices.append(
                            (
                                x + cx - width / 2.0,
                                height / 2.0 - (y + cy),
                                (z + cz) * 1.35 - depth * 1.35 / 2.0,
                            )
                        )
                    yield normal, vertices, tuple(int(v) for v in colors[y, x, :3])


def triangle_normal(a, b, c):
    ux, uy, uz = (b[i] - a[i] for i in range(3))
    vx, vy, vz = (c[i] - a[i] for i in range(3))
    nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
    length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
    return nx / length, ny / length, nz / length


def write_binary_stl(path: Path, faces) -> int:
    faces = list(faces)
    triangle_count = len(faces) * 2
    header = b"Belleville console voxel relief".ljust(80, b"\0")
    with path.open("wb") as stream:
        stream.write(header)
        stream.write(struct.pack("<I", triangle_count))
        for _normal, vertices, _color in faces:
            for indices in ((0, 1, 2), (0, 2, 3)):
                triangle = [vertices[index] for index in indices]
                normal = triangle_normal(*triangle)
                stream.write(struct.pack("<3f", *normal))
                for vertex in triangle:
                    stream.write(struct.pack("<3f", *vertex))
                stream.write(struct.pack("<H", 0))
    return triangle_count


def render_preview(path: Path, faces, size: int = 768) -> None:
    yaw = math.radians(-34)
    pitch = math.radians(18)

    def project(vertex):
        x, y, z = vertex
        rx = x * math.cos(yaw) + z * math.sin(yaw)
        rz = -x * math.sin(yaw) + z * math.cos(yaw)
        ry = y * math.cos(pitch) - rz * math.sin(pitch)
        depth = y * math.sin(pitch) + rz * math.cos(pitch)
        return rx, ry, depth

    projected = []
    bounds = []
    light = np.array((-0.4, 0.65, 0.65), dtype=float)
    light /= np.linalg.norm(light)
    for normal, vertices, color in faces:
        points = [project(vertex) for vertex in vertices]
        bounds.extend((x, y) for x, y, _ in points)
        shade = 0.55 + 0.45 * max(0.0, float(np.dot(np.array(normal), light)))
        shaded = tuple(max(0, min(255, round(channel * shade))) for channel in color)
        projected.append((sum(point[2] for point in points) / 4.0, points, shaded))

    min_x = min(x for x, _ in bounds)
    max_x = max(x for x, _ in bounds)
    min_y = min(y for _, y in bounds)
    max_y = max(y for _, y in bounds)
    margin = 36
    scale = min((size - 2 * margin) / (max_x - min_x), (size - 2 * margin) / (max_y - min_y))

    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    for _depth, points, color in sorted(projected, key=lambda item: item[0]):
        polygon = [
            (
                margin + (x - min_x) * scale,
                size - margin - (y - min_y) * scale,
            )
            for x, y, _ in points
        ]
        draw.polygon(polygon, fill=(*color, 255))
    image.save(path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--preview", type=Path)
    args = parser.parse_args()

    image = Image.open(args.source)
    volume, colors = build_volume(image)
    faces = list(exposed_faces(volume, colors))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    triangle_count = write_binary_stl(args.output, faces)
    if args.preview:
        args.preview.parent.mkdir(parents=True, exist_ok=True)
        render_preview(args.preview, faces)
    print(
        f"wrote {args.output}: {triangle_count} triangles, "
        f"{int(volume.sum())} occupied voxels, {volume.shape[2]} depth layers"
    )


if __name__ == "__main__":
    main()
