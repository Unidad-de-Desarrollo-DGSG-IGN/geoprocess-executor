import "reflect-metadata";

import { container } from "tsyringe";

import WaterRiseHandler from "../src/WaterRise/application/WaterRiseHandler";
import WaterRiseService from "../src/WaterRise/application/WaterRiseService";
import WaterRisePostmanTest from "./infrastructure/WaterRisePostmanTest";

container.register("Postman", {
  useClass: WaterRisePostmanTest,
});

test("Get Water Rise form", () => {
  const waterRiseHandler = new WaterRiseHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(WaterRiseService)
  );
  const expectedFields = JSON.parse(
    `[
      {
        "name": "Capa",
        "element": "select",
        "references": "drawedLayers",
        "allowedTypes": ["rectangle"],
        "points": ["ne", "sw"]
      },
      {
        "name": "Cota",
        "element": "input",
        "type": "number",
        "min": 0,
        "max": 10000
      }
    ]`
  );
  expect(waterRiseHandler.getFields()).toEqual(expectedFields);
});

test("Execute succesful Water Rise", async () => {
  const postmanTest = new WaterRisePostmanTest();
  const waterRiseHandler = new WaterRiseHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(WaterRiseService)
  );

  expect.assertions(1);
  const result = await waterRiseHandler.execute(
    -69.84479,
    -34.17065,
    -69.82531,
    -34.15469,
    100
  );
  expect(result).toEqual(postmanTest.getResponseTest());
});

test("Execute succesful Water Rise when request area touch higher and lower surface", async () => {
  const postmanTest = new WaterRisePostmanTest();
  const waterRiseHandler = new WaterRiseHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(WaterRiseService)
  );

  expect.assertions(1);
  const result = await waterRiseHandler.execute(
    -63.53331,
    -34.17846,
    -63.52048,
    -34.16922,
    10
  );
  expect(result).toEqual(postmanTest.getResponseTest());
});

test("Execute Water Rise and get Coordinates Exception", async () => {
  const waterRiseHandler = new WaterRiseHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(WaterRiseService)
  );

  expect.assertions(2);
  try {
    await waterRiseHandler.execute(1, 1, 1, 1, 1);
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The latitud must be between -74 and -52");
  }
});

test("Execute Water Rise and get Area Requested Exception", async () => {
  const waterRiseHandler = new WaterRiseHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(WaterRiseService)
  );

  expect.assertions(2);
  try {
    await waterRiseHandler.execute(
      -63.68053,
      -34.02598,
      -63.22427,
      -33.82642,
      100
    );
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The area requested must be less than 100km2");
  }
});
