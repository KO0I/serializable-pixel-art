# RFL item sources

`rfl-source/catalog-source.json` indexes 130 static items. Each source file has a SHA-256 hash. The 12 modular characters and their 35 fits have been removed from this repository; character development now belongs in the separate Character Workbench. Archived/procedural exclusions remain recorded in the index.

This directory contains asset data. The mesh exporter and shared pose/spring code live in the private `KO0I/rasd-fastwalker-league-js` repository, under `tools/xpm-export`.

After changes to the committed asset sources and index, the RFL hourly/manual sync builds the complete catalog and opens one update pull request. It rebuilds changed fits, validates the result and refreshes the release allowlist. Merge the RFL integration PR to enable that workflow. GitHub Actions must be permitted to create PRs.

To refresh this whole directory from the current XPM Site source, run the RFL helper:

```
node tools/xpm-export/refresh-sources.cjs /path/to/current-xpm-site-source /path/to/serializable-pixel-art/rfl-source
```

Then commit the directory here. Uncommitted editor changes and private Site storage are not visible to GitHub CI. The public workflow validates all source hashes and provides the source catalog as an Actions artifact.
