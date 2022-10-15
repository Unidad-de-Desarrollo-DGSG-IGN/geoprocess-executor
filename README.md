# Geoprocess executor

Javascript library to execute geoprocess written in TypeScript.

## How to use
The library compiled file is into "dist" directory.

1. Include the library file in your html page:
```js
<script src="main.js"></script>
```

2. The entry point name is "GeoserviceFactory". From this entry point you can access to all classes. For example, to consume Contour geoprocess:
```js
<script>
    let contour = new GeoserviceFactory.Contour(       
      "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
      "workspace:layerName"
    );
    console.log(contour.getFields());
    contour
      .execute(-69.8151, -34.1526, -69.8061, -34.1410, 100)
      .then((result) => {
        console.log(result);
      })
      .catch((ex) => {
        console.log(ex.message);
      });
</script>
```

3. Another example to consume Elevation Profile geoprocess (in execute method the second parameter is optional, the default value is GeoserviceFactory.ElevationProfileResponseType.LineString3D ):
```js
<script>
    let elevationProfile = new GeoserviceFactory.ElevationProfileGetFeatureInfo(       
      "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
      "workspace:layerName"
    );
    console.log(elevationProfile.getFields());
    elevationProfile
      .execute(
        "-69.8994766897101 -32.895181037843,-69.8994766897102 -32.895181037844",
        GeoserviceFactory.ElevationProfileResponseType.LineString3D
      )
      .then((result) => {
        console.log(result);
      })
      .catch((ex) => {
        console.log(ex.message);
      });
</script>
```

4. Another example to consume Water Rise geoprocess:
```js
<script>
    let waterRise = new GeoserviceFactory.WaterRise(       
      "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
      "workspace:layerName"
    );
    console.log(waterRise.getFields());
    waterRise
      .execute(
        `-69.696212581553127 -34.207204894110262,
         -69.799409776448044 -34.220104543472132,
         -69.799789090436576 -34.110482800785661,
         -69.717829710947697 -34.13467138556318,
         -69.696212581553127 -34.207204894110262`,
        3316,
        "image/png",
        "#FF0000",
        1.0
      )
      .then((result) => {
        console.log(result);
      })
      .catch((ex) => {
        console.log(ex.message);
      });
</script>
```

5. Another example to consume Elevation of a single Point geoprocess:
```js
<script>
    let elevationOfPoint = new GeoserviceFactory.ElevationOfPoint(       
      "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
      "workspace:layerName"
    );
    console.log(elevationOfPoint.getFields());
    elevationProfile
      .execute(
        "-69.8994766897101 -32.895181037843",
        GeoserviceFactory.ElevationOfPointResponseType.Point3D)
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
Generates the contour lines of the area given two coordinates (lower left lat/lon and upper right lat/lon) and an equidistance.

**Methods**

- constructor(wpsEndpoint, mdeLayerFullname): when you generate a new instance of the class Contour, you must to indicate the WPS endpoind and the full name (example: workspace:layerName) of the mde layer that you wish to use.
- getFields(): retrive an object indicating those geoprocess inputs.
- async execute(longitudeLower, latitudeLower, longitudeUpper, latitudeUpper, equidistance): send the input data and the execute message to Geoserver WPS API. Retrieve JSON data with geoprocess result.

### class ElevationProfileGetFeatureInfo
Add the height data given a line.

**Methods**

- constructor(wpsEndpoint, mdeLayerFullname): when you generate a new instance of the class ElevationProfile, you must to indicate the WPS endpoind and the full name (example: workspace:layerName) of the mde layer that you wish to use.
- getFields(): retrive an object indicating those geoprocess inputs.
- async execute(lineString, ?responseType): send the input data and the execute message to Geoserver WPS API. Retrieve JSON data with geoprocess result. The optional parameter responseType set the response type that be send to browser, it value could be "GeoserviceFactory.ElevationProfileResponseType.LineString3D" (return a GeoJson with 3D LineString, the Z dimension is height) or "GeoserviceFactory.ElevationProfileResponseType.FeatureCollectionOfLines" (returns the height like a parameter of the Line). The default value is LineString3D.

### class WaterRise
Generates a polygon of an area containing all height less than the requested height.

**Methods**

- constructor(wpsEndpoint): when you generate a new instance of the class WaterRise, you must to indicate the WPS endpoind and the full name (example: workspace:layerName) of the mde layer that you wish to use.
- getFields(): retrive an object indicating those geoprocess inputs.
- async execute(polygonString, level, outputFormat, areaBackgroundColor, areaOpacity): send the input data and the execute message to Geoserver WPS API. Retrieve JSON data with geoprocess result.
The outputFormat parameter is optional. The valid output formats are: "image/png", "image/jpeg" and "image/tiff". Default value is "image/png".
The areaBackgroundColor parameter is optional. This parameter apply this color over the resulting area only when outputFormat is "image/png". The valid colors are in RGB style, by example: "#00FF00" or "#557478". Default value is "#FF0000".
The areaOpacity parameter is optional. This parameter apply opacity to the resulting area only when outputFormat is "image/png". The valid values are between 0.0 and 1.0. Default value is 1.0.

### class ElevationOfPoint
Add the height data given a point.

**Methods**

- constructor(wpsEndpoint): when you generate a new instance of the class ElevationProfile, you must to indicate the WPS endpoind and the full name (example: workspace:layerName) of the mde layer that you wish to use.
- getFields(): retrive an object indicating those geoprocess inputs.
- async execute(pointString, ?responseType): send the input data and the execute message to Geoserver WPS API. Retrieve JSON data with geoprocess result. The optional parameter responseType set the response type that be send to browser, it value could be "Point3D" (return a GeoJson with 3D Point, the Z dimension is height) or "FeatureCollectionOfPoint" (returns the height like a parameter of the Line). The default value is Point3D.

## How this uses Geoserver WPS

The library uses the Geoserver WPS service. Each geoprocess concatenates the WPS requests necessary to carry out its objective. The WPS requests used in each geoprocess are shown below:

### Contour sequence diagram
![Contour sequence diagram](/docs/ContourSequence.png)

### Elevation Profile sequence diagram
![Contour sequence diagram](/docs/ElevationProfileSequence.png)

### Water Rise sequence diagram
![Contour sequence diagram](/docs/WaterRiseSequence.png)

### Elevation Of Point sequence diagram
![Contour sequence diagram](/docs/ElevationOfPointSequence.png)

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
- [TurfJS](https://turfjs.org)

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
