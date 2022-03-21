import "reflect-metadata";

import { container } from "tsyringe";

import ElevationProfileHandler from "../src/ElevationProfile/application/ElevationProfileHandler";
import { ElevationProfileResponseType } from "../src/ElevationProfile/application/ElevationProfileResponseType";
import ElevationProfileService from "../src/ElevationProfile/application/ElevationProfileService";
import TurfJSElevationProfileToleranceChecker from "../src/ElevationProfile/infraestructure/TurfJSElevationProfileToleranceChecker";
import TurfJSLineToPointsInterval from "../src/Shared/infrastructure/TurfJSLineToPointsInterval";
import ElevationProfilePostmanTest from "./infrastructure/ElevationProfilePostmanTest";

container.register("Postman", {
  useClass: ElevationProfilePostmanTest,
});
container.register("LineToPointsInterval", {
  useClass: TurfJSLineToPointsInterval,
});
container.register("ElevationProfileToleranceChecker", {
  useClass: TurfJSElevationProfileToleranceChecker,
});

test("Get Elevation Profile form", () => {
  const elevationProfileHandler = new ElevationProfileHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(TurfJSLineToPointsInterval),
    container.resolve(ElevationProfileService)
  );
  const expectedFields = JSON.parse(
    `[
      {
        "name": "Capa",
        "element": "select",
        "references": "drawedLayers",
        "allowedTypes": ["line"],
        "points": ["ne", "sw"]
      }
    ]`
  );
  expect(elevationProfileHandler.getFields()).toEqual(expectedFields);
});

test("Execute succesful Elevation Profile with 3D LineString response", async () => {
  const postmanTest = new ElevationProfilePostmanTest();
  const elevationProfileHandler = new ElevationProfileHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(TurfJSLineToPointsInterval),
    container.resolve(ElevationProfileService)
  );

  expect.assertions(1);
  const result = await elevationProfileHandler.execute(
    "-69.8994766897101 -32.895181037843,-69.8994766897102 -32.895181037844"
  );
  expect(result).toEqual(postmanTest.getResponseTestWith3DLineStringResponse());
});

test("Execute succesful Elevation Profile with Feature Collection response", async () => {
  const postmanTest = new ElevationProfilePostmanTest();
  const elevationProfileHandler = new ElevationProfileHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(TurfJSLineToPointsInterval),
    container.resolve(ElevationProfileService)
  );

  expect.assertions(1);
  const result = await elevationProfileHandler.execute(
    "-69.8994766897101 -32.895181037843,-69.8994766897102 -32.895181037844",
    ElevationProfileResponseType.FeatureCollectionOfLines
  );
  expect(result).toEqual(
    postmanTest.getResponseTestWithFeatureCollectionWithHeightPropertyResponse()
  );
});

test("Execute Elevation Profile and get Coordinates Exception", async () => {
  const elevationProfileHandler = new ElevationProfileHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(TurfJSLineToPointsInterval),
    container.resolve(ElevationProfileService)
  );

  expect.assertions(2);
  try {
    await elevationProfileHandler.execute("1 1");
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The longitude must be between -74 and -52");
  }
});

// test("Execute Elevation Profile and get Line Lenght Exception", async () => {
//   const elevationProfileHandler = new ElevationProfileHandler(
//     "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
//     container.resolve(TurfJSLineToPointsInterval),
//     container.resolve(ElevationProfileService)
//   );

//   expect.assertions(2);
//   try {
//     await elevationProfileHandler.execute(
//       "-62.781702786449884 -26.24742367352862, -67.79146800929664 -40.39117129637443"
//     );
//   } catch (e) {
//     expect(e instanceof RangeError).toBeTruthy();
//     expect(e.message).toEqual(
//       "The line length requested must be less than 100km"
//     );
//   }
// });
