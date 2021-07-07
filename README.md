# Geoprocess executor

Javascript library to execute geoprocess written in TypeScript.

## How to use
The library compiled file is into "dist" directory.

1. Include the library file in your html page:
```sh
<script src="main.js"></script>
```

2. The entry point name is "GeoserviceFactory". From this entry point you can access to all classes. For example, to consume Contour geoprocess:
```sh
<script>
    let contour = new GeoserviceFactory.Contour(       
      "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0"
    );
    console.log(contour.getFields());
    contour
      .execute(-69.84479, -34.17065, -69.82531, -34.15469, 100)
      .then((result) => {
        console.log(result);
      })
      .catch((ex) => {
        console.log(ex.message);
      });
</script>
```

3. Another example to consume Elevation Profile geoprocess (to get more info about "elevation-profile" service, go to [Geoprocess Backend](https://github.com/Unidad-de-Desarrollo-DGSG-IGN/geoprocess-backend)):
```sh
<script>
    let elevationProfile = new GeoserviceFactory.ElevationProfile(       
      "http://127.0.0.1/geoprocess-backend/elevation-profile"
    );
    console.log(elevationProfile.getFields());
    elevationProfile
      .execute("-69.8994766897101 -32.895181037843,-69.8994766897102 -32.895181037844")
      .then((result) => {
        console.log(result);
      })
      .catch((ex) => {
        console.log(ex.message);
      });
</script>
```

## Public classes and methods
### class Contour
Allow to execute gs:Contour geoprocess from Geoserver

**Methods**

- constructor(wpsEndpoint): when you generate a new instance of the class Contour, you must to indicate the WPS endpoind that you wish to use.
- getFields(): retrive an object indicating those geoprocess inputs.
- async execute(longitudeLower, latitudeLower, longitudeUpper, latitudeUpper, equidistance): send the input data and the execute message to Geoserver WPS API. Retrieve JSON data with geoprocess result.

## Used technology

- [TypeScript](https://www.typescriptlang.org/) (v4)
- [Webpack](https://webpack.js.org/) (v5)
- [Babel](https://babeljs.io/) with [preset-env](https://babeljs.io/docs/en/babel-preset-env)
- [TSyringe](https://github.com/microsoft/tsyringe)
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
