# XPM Workbench

A deploy-ready static XPM editor with 2D and 2.5D rendering, STL import,
slice-stack XPM export, categorized examples, auto-orbit, a two-XPM sphere
impostor with orthogonal slice stacks, rotated-view world lighting, and angle-weighted blending, a solid-cube
two-XPM impostor with independently switchable views and six face-color controls, a glass-cube
impostor over selectable checkerboard, grass, sand, or mossy-rock terrain, and a
color-adjustable refractive glass sphere with scatter, dispersion, absorption, an explicit
opaque mirror mode, and an optional Hi-Fi dielectric ray path with exact
Fresnel reflection, two-interface Snell refraction, and total internal
reflection. Terrain-backed examples use a continuous projected ground mesh to
avoid slice-stack moiré. The **smol plate class:** substrate uses a second projected
mesh behind its terrain so the plate support cannot overdraw the surface. Its
surface selector switches between a temperate garden, ridged ice, a dune-like
cactus desert, a red-dwarf biome, and a K-star biome. The red-dwarf plate uses
magenta sand, large dark-red boulders, clustered light-blue lichen, sparse twisty
black vegetation with purple leaves, and animated black-purple grass. The K-star
plate uses orange trees and bushes, blue-grey boulders with orange moss, large
teal flowers, brown ground, and yellow grass. The class retains independent
low-flora, tall-flora, ground-cover, accent-flora, and suspended-light XPM layers,
with adjustable light intensity, spread, and hue. A separate grass-pond entry
wraps the temperate layers around an irregular
indexed-water shoreline. A central-grass-pool entry uses a wider, mostly grass
field with a smaller irregularly round pool centered in the meadow. The bush and tree each use paired front and -90-degree Y XPM
impostors with angle-weighted blending. An interactive water scene ports the
Godot compute-texture ripple equation to two JavaScript float buffers, shades
the height field through a fixed indexed palette, supports drawn waves, rain,
damping, and rotation, and exports either the current XPM or a 4-by-4 animation
atlas. Water-area presets range from 64-by-64 to 128-by-128, while selectable
light spectra drive additive, surface-aware caustics. The submerged XPM layer
can render clovers, short grass strands, tall grass, or a bare bottom in both
2D and 2.5D. Damping spans 10 through 50, surface opacity is adjustable, and a
liquid-metal mode makes the water opaque and reflective while disabling
caustics. It also includes a separate animated glass sphere with amplitude
and frequency controls, plus Drone B: an entirely reflective, opaque mirror
sphere enclosed by a glass shell with angry, inquisitive, and pleased mood
behaviors. Angry glows white,
shakes, and cycles from clear to scattered; inquisitive turns green and shows
a purple question mark; pleased emits a pulsing red glow. Its amplitude and
frequency controls drive the mood motion and pulses, while its surface menu
switches the XPM scene among checkerboard, grass, layered sand dunes, and mossy
rocks. The Workbench also includes the built-in Scoundrel model. Mirror mode
disables the transmission controls while it is active.

This repository layout is intentionally flat so it can be mounted directly as
a Git submodule inside a Jekyll site. No Node, Ruby, or build step is required.

## Create the standalone repository

Create a public GitHub repository such as `KO0I/xpm-workbench`, place these
files at its root, and push them:

```sh
git init
git add .
git commit -m "Publish XPM Workbench"
git branch -M main
git remote add origin https://github.com/KO0I/xpm-workbench.git
git push -u origin main
```

## Add it to KO0I.github.io

From the root of the Jekyll repository:

```sh
git submodule add \
  https://github.com/KO0I/xpm-workbench.git \
  tools/xpm
git add .gitmodules tools/xpm
git commit -m "Add XPM Workbench"
git push
```

The published application will be available at:

`https://chipchirp.digital/tools/xpm/`

GitHub Pages requires the submodule repository to be public and its URL in
`.gitmodules` to use HTTPS.

## Update the pinned Workbench revision

```sh
git submodule update --remote tools/xpm
git add tools/xpm
git commit -m "Update XPM Workbench"
git push
```

For a fresh checkout of the Jekyll site, clone with submodules:

```sh
git clone --recurse-submodules \
  https://github.com/KO0I/KO0I.github.io.git
```
