import "reflect-metadata";

import { container } from "tsyringe";

import ElevationOfPointHandler from "../src/ElevationOfPoint/application/ElevationOfPointHandler";
import { ElevationOfPointResponseType } from "../src/ElevationOfPoint/application/ElevationOfPointResponseType";
import ElevationOfPointService from "../src/ElevationOfPoint/application/ElevationOfPointService";
import TurfJSElevationOfPointToleranceChecker from "../src/ElevationOfPoint/infraestructure/TurfJSElevationOfPointToleranceChecker";
import ElevationOfPointPostmanTest from "./infrastructure/ElevationOfPointPostmanTest";

container.register("Postman", {
  useClass: ElevationOfPointPostmanTest,
});
container.register("ElevationOfPointToleranceChecker", {
  useClass: TurfJSElevationOfPointToleranceChecker,
});

test("Get Elevation of Point form", () => {
  const elevationOfPointHandler = new ElevationOfPointHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ElevationOfPointService)
  );
  const expectedFields = JSON.parse(
    `[
      {
        "name": "Capa",
        "element": "select",
        "references": "drawedLayers",
        "allowedTypes": ["point"]
      }
    ]`
  );
  expect(elevationOfPointHandler.getFields()).toEqual(expectedFields);
});

test("Execute succesful Elevation of Point with 3D Point response", async () => {
  const postmanTest = new ElevationOfPointPostmanTest();
  const elevationOfPointHandler = new ElevationOfPointHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ElevationOfPointService)
  );

  expect.assertions(1);
  const result = await elevationOfPointHandler.execute(
    "-69.8994766897101 -32.895181037843"
  );
  expect(result).toEqual(postmanTest.getResponseTestWith3DPointResponse());
});

test("Execute succesful Elevation Profile with Feature Collection response", async () => {
  const postmanTest = new ElevationOfPointPostmanTest();
  const elevationProfileHandler = new ElevationOfPointHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ElevationOfPointService)
  );

  expect.assertions(1);
  const result = await elevationProfileHandler.execute(
    "-69.8994766897101 -32.895181037843",
    ElevationOfPointResponseType.FeatureCollectionOfPoint
  );
  expect(result).toEqual(
    postmanTest.getResponseTestWithFeatureCollectionWithHeightPropertyResponse()
  );
});

test("Execute Elevation of Point and get Coordinates Exception", async () => {
  const elevationOfPointHandler = new ElevationOfPointHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ElevationOfPointService)
  );

  expect.assertions(2);
  try {
    await elevationOfPointHandler.execute("1 1");
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The longitude must be between -74 and -52");
  }
});
