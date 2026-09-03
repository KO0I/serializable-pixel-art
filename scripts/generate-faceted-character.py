#!/usr/bin/env python3
"""Generate the built-in faceted character as a deterministic binary STL."""

from __future__ import annotations

import math
import struct
from pathlib import Path


Vec3 = tuple[float, float, float]
Triangle = tuple[Vec3, Vec3, Vec3]
triangles: list[Triangle] = []


def add(a: Vec3, b: Vec3) -> Vec3:
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def subtract(a: Vec3, b: Vec3) -> Vec3:
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def scale(vector: Vec3, amount: float) -> Vec3:
    return (vector[0] * amount, vector[1] * amount, vector[2] * amount)


def cross(a: Vec3, b: Vec3) -> Vec3:
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def length(vector: Vec3) -> float:
    return math.sqrt(sum(component * component for component in vector))


def normalize(vector: Vec3) -> Vec3:
    magnitude = length(vector)
    if magnitude < 1e-9:
        return (0.0, 0.0, 0.0)
    return scale(vector, 1.0 / magnitude)


def triangle(a: Vec3, b: Vec3, c: Vec3) -> None:
    triangles.append((a, b, c))


def quad(a: Vec3, b: Vec3, c: Vec3, d: Vec3) -> None:
    triangle(a, b, c)
    triangle(a, c, d)


def add_loft(rings: list[tuple[Vec3, float, float]], sides: int = 10) -> None:
    vertices: list[list[Vec3]] = []
    for center, radius_x, radius_z in rings:
        vertices.append([
            (
                center[0] + math.cos(index * 2 * math.pi / sides) * radius_x,
                center[1],
                center[2] + math.sin(index * 2 * math.pi / sides) * radius_z,
            )
            for index in range(sides)
        ])

    for first, second in zip(vertices, vertices[1:]):
        for index in range(sides):
            next_index = (index + 1) % sides
            quad(first[index], first[next_index], second[next_index], second[index])

    first_center = rings[0][0]
    last_center = rings[-1][0]
    for index in range(sides):
        next_index = (index + 1) % sides
        triangle(first_center, vertices[0][next_index], vertices[0][index])
        triangle(last_center, vertices[-1][index], vertices[-1][next_index])


def add_tube(points: list[Vec3], radii: list[float], sides: int = 8) -> None:
    if len(points) != len(radii):
        raise ValueError("Each path point needs a radius.")

    rings: list[list[Vec3]] = []
    for index, (point, radius) in enumerate(zip(points, radii)):
        before = points[max(0, index - 1)]
        after = points[min(len(points) - 1, index + 1)]
        tangent = normalize(subtract(after, before))
        across = normalize(cross((0.0, 0.0, 1.0), tangent))
        if length(across) < 1e-9:
            across = (1.0, 0.0, 0.0)
        depth = normalize(cross(tangent, across))
        rings.append([
            add(
                point,
                add(
                    scale(across, math.cos(side * 2 * math.pi / sides) * radius),
                    scale(depth, math.sin(side * 2 * math.pi / sides) * radius),
                ),
            )
            for side in range(sides)
        ])

    for first, second in zip(rings, rings[1:]):
        for index in range(sides):
            next_index = (index + 1) % sides
            quad(first[index], first[next_index], second[next_index], second[index])

    for index in range(sides):
        next_index = (index + 1) % sides
        triangle(points[0], rings[0][next_index], rings[0][index])
        triangle(points[-1], rings[-1][index], rings[-1][next_index])


def add_ellipsoid(
    center: Vec3,
    radii: Vec3,
    longitude_steps: int = 10,
    latitude_steps: int = 7,
) -> None:
    rings: list[list[Vec3]] = []
    for latitude in range(1, latitude_steps):
        phi = -math.pi / 2 + latitude * math.pi / latitude_steps
        ring_scale = math.cos(phi)
        rings.append([
            (
                center[0] + radii[0] * ring_scale * math.cos(longitude * 2 * math.pi / longitude_steps),
                center[1] + radii[1] * math.sin(phi),
                center[2] + radii[2] * ring_scale * math.sin(longitude * 2 * math.pi / longitude_steps),
            )
            for longitude in range(longitude_steps)
        ])

    bottom = (center[0], center[1] - radii[1], center[2])
    top = (center[0], center[1] + radii[1], center[2])
    for index in range(longitude_steps):
        next_index = (index + 1) % longitude_steps
        triangle(bottom, rings[0][index], rings[0][next_index])
        triangle(top, rings[-1][next_index], rings[-1][index])

    for first, second in zip(rings, rings[1:]):
        for index in range(longitude_steps):
            next_index = (index + 1) % longitude_steps
            quad(first[index], first[next_index], second[next_index], second[index])


def add_extruded_polygon(points: list[tuple[float, float]], back: float, front: float) -> None:
    back_vertices = [(x, y, back) for x, y in points]
    front_vertices = [(x, y, front) for x, y in points]
    for index in range(1, len(points) - 1):
        triangle(back_vertices[0], back_vertices[index + 1], back_vertices[index])
        triangle(front_vertices[0], front_vertices[index], front_vertices[index + 1])
    for index in range(len(points)):
        next_index = (index + 1) % len(points)
        quad(
            back_vertices[index],
            back_vertices[next_index],
            front_vertices[next_index],
            front_vertices[index],
        )


def build_character() -> None:
    # One connected hourglass torso, ending in a narrow neck.
    add_loft([
        ((0.0, 78.0, 0.0), 18.0, 7.0),
        ((0.0, 89.0, 0.0), 15.0, 6.5),
        ((0.0, 101.0, 0.0), 11.0, 5.3),
        ((0.0, 113.0, 0.0), 18.0, 7.0),
        ((0.0, 123.0, 0.0), 22.0, 6.5),
        ((0.0, 130.0, 0.0), 5.0, 4.2),
        ((0.0, 133.0, 0.0), 3.5, 3.4),
    ])

    # Long, slightly asymmetric legs with pointed feet.
    add_tube(
        [(-9.0, 78.0, 0.0), (-9.5, 64.0, 0.0), (-7.5, 47.0, 0.0),
         (-7.0, 27.0, 0.4), (-8.0, 7.0, 1.0), (-8.0, -6.0, 2.7)],
        [8.0, 7.2, 5.8, 4.4, 2.8, 1.1],
    )
    add_tube(
        [(9.0, 78.0, 0.0), (10.0, 63.0, 0.0), (8.0, 45.0, 0.0),
         (8.5, 25.0, -0.3), (7.0, 5.0, 0.7), (7.0, -7.0, 2.4)],
        [8.0, 7.0, 5.7, 4.3, 2.7, 1.1],
    )

    # Slender arms and tapered hands, held away from the torso.
    add_tube(
        [(-26.0, 120.0, 0.0), (-29.0, 105.0, 0.0), (-33.0, 88.0, 0.0),
         (-38.0, 72.0, 0.0), (-41.0, 61.0, 0.7), (-42.5, 55.0, 1.3)],
        [4.2, 3.8, 3.2, 2.5, 1.7, 0.7],
        sides=7,
    )
    add_tube(
        [(26.0, 120.0, 0.0), (29.0, 104.0, 0.0), (33.5, 86.0, 0.0),
         (39.0, 70.0, 0.0), (42.0, 59.0, 0.7), (43.5, 53.0, 1.3)],
        [4.2, 3.8, 3.2, 2.5, 1.7, 0.7],
        sides=7,
    )

    # Angular face and a geometric bob constructed as non-overlapping shells.
    add_ellipsoid((0.0, 145.0, 1.0), (9.0, 12.0, 5.0), 9, 6)
    add_extruded_polygon(
        [(-17.0, 132.0), (-20.0, 145.0), (-17.0, 157.0), (-9.0, 165.0),
         (3.0, 168.0), (14.0, 163.0), (20.0, 150.0), (18.0, 136.0), (12.0, 130.0)],
        -9.0,
        -5.0,
    )
    add_extruded_polygon(
        [(-19.0, 132.0), (-21.0, 145.0), (-16.0, 159.0), (-10.5, 157.0), (-10.0, 132.0)],
        -4.0,
        3.5,
    )
    add_extruded_polygon(
        [(10.0, 132.0), (11.0, 157.0), (16.0, 160.0), (21.0, 148.0), (18.0, 131.0)],
        -4.0,
        3.5,
    )

    # Bangs, luminous-looking eye plates, and a small raised mouth plate.
    add_extruded_polygon([(-9.0, 153.0), (-5.5, 159.0), (-3.0, 153.0)], 6.2, 7.1)
    add_extruded_polygon([(-3.0, 153.0), (0.0, 159.5), (2.5, 153.0)], 6.2, 7.1)
    add_extruded_polygon([(2.5, 153.0), (6.0, 159.0), (9.0, 153.0)], 6.2, 7.1)
    add_ellipsoid((-4.1, 148.0, 6.35), (2.4, 1.15, 0.45), 6, 4)
    add_ellipsoid((4.1, 148.0, 6.35), (2.4, 1.15, 0.45), 6, 4)
    add_ellipsoid((0.0, 139.5, 6.0), (2.2, 0.8, 0.4), 6, 4)

    # Raised front traces echo the glowing cyan seams in the reference.
    add_tube(
        [(-18.0, 120.0, 8.1), (-13.5, 111.0, 8.4), (-11.2, 99.0, 7.5),
         (-13.5, 85.0, 8.0)],
        [0.65, 0.65, 0.65, 0.65],
        sides=5,
    )
    add_tube(
        [(18.0, 120.0, 8.1), (13.5, 111.0, 8.4), (11.2, 99.0, 7.5),
         (13.5, 85.0, 8.0)],
        [0.65, 0.65, 0.65, 0.65],
        sides=5,
    )
    add_tube(
        [(-2.5, 128.0, 7.2), (-0.8, 119.0, 8.0), (0.0, 109.0, 8.2)],
        [0.6, 0.6, 0.6],
        sides=5,
    )


def normal_for(a: Vec3, b: Vec3, c: Vec3) -> Vec3:
    return normalize(cross(subtract(b, a), subtract(c, a)))


def write_binary_stl(path: Path) -> None:
    header = b"XPM Workbench faceted character".ljust(80, b" ")
    with path.open("wb") as output:
        output.write(header)
        output.write(struct.pack("<I", len(triangles)))
        for a, b, c in triangles:
            normal = normal_for(a, b, c)
            output.write(struct.pack("<12fH", *normal, *a, *b, *c, 0))


def main() -> None:
    build_character()
    destination = Path(__file__).resolve().parents[1] / "models" / "faceted_character.stl"
    destination.parent.mkdir(parents=True, exist_ok=True)
    write_binary_stl(destination)
    vertices = [vertex for face in triangles for vertex in face]
    minimum = tuple(min(vertex[axis] for vertex in vertices) for axis in range(3))
    maximum = tuple(max(vertex[axis] for vertex in vertices) for axis in range(3))
    print(f"Wrote {destination}")
    print(f"Triangles: {len(triangles)}")
    print(f"Bounds: {minimum} to {maximum}")


if __name__ == "__main__":
    main()
