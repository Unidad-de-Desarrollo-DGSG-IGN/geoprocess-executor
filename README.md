# Geoprocess executor

Javascript library to execute geoprocess written in TypeScript.

## How to use
The library compiled file is into "dist" directory.

1. Include the library file in your html page:
```sh
<script src="main.js"></script>
```

2. The entry point name is "GeoserviceFactory". From this entry point you can access to all classes. For example:
```sh
<script>
    let contour = new GeoserviceFactory.Contour();
    contour
      .execute(-69.84479, -34.17065, -69.82531, -34.15469, 100)
      .then((result) => {
        console.log(result);
      });
</script>
```

## Public classes and methods
### class Contour
Allow to execute gs:Contour geoprocess from Geoserver

**Methods**

- getForm(): retrive HTML form with geoprocess inputs.
- async execute(longitudeLower, latitudeLower, longitudeUpper, latitudeUpper, equidistance): send the input data and the execute message to Geoserver WPS API. Retrieve JSON data with geoprocess result.

## Used technology

- [TypeScript](https://www.typescriptlang.org/) (v4)
- [Webpack](https://webpack.js.org/) (v5)
- [Babel](https://babeljs.io/) with [preset-env](https://babeljs.io/docs/en/babel-preset-env)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/) with:
  - [Simple Import Sort](https://github.com/lydell/eslint-plugin-simple-import-sort/)
  - [Import plugin](https://github.com/benmosher/eslint-plugin-import/)
  - [HTML plugin](https://github.com/BenoitZugmeyer/eslint-plugin-html)
  - And a few other ES2015+ related rules
- [Jest](https://jestjs.io) with [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)
- [GitHub Action workflows](https://github.com/features/actions) set up to run tests and linting on push

## Installation and build

```
# install dependencies
npm install

# generate production build
npm run build
```

The library was developed using npm 6.14.4

## Testing

### Jest with Testing Library

```
npm run test
```

## Linting

```
# run linter
npm run lint

# fix lint issues
npm run lint:fix
```
