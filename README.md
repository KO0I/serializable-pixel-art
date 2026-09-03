# XPM Workbench

A deploy-ready static XPM editor with 2D and 2.5D rendering, STL import,
slice-stack XPM export, categorized examples, auto-orbit, a two-XPM sphere
impostor with orthogonal slice stacks and angle-weighted blending, a color-adjustable
refractive glass sphere with scatter, dispersion, absorption, an explicit
opaque mirror mode, and an optional Hi-Fi dielectric ray path with exact
Fresnel reflection, two-interface Snell refraction, and total internal
reflection. It also includes a separate animated glass sphere with amplitude
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
