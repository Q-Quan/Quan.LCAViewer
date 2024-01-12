# Quan.LCAViewer

An LCA Viewer, for visualising, browsing and sharing LCA results exported from the [Activity Browser](https://github.com/LCA-ActivityBrowser/activity-browser).

Sample hosted on https://qlcav.quan.cat/sample.

## Features

<img src="screenshot.jpg" width=100%/>

Visualisation of characterisation and normalisation results, including the possiblity to showcase and filter on a wide array of alternatives, alternate scenarios, and multiple points in time. For an LCA practitioner, this facilitates the exploration of results and obtaining insights. For commissioners or interested parties, this can be a way to share LCA results in an interactive and easily accessible way, without the need to browse through reports or install software.


## How to use

The file `/data/metadata.json` contains the configuration to load, including the data file paths (characterisation data CSV exports), setup and labelling of alternatives and impact categories, and theming.


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
