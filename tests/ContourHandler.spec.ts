import "reflect-metadata";

import { container } from "tsyringe";

import ContourHandler from "../src/Contour/application/ContourHandler";
import ContourService from "../src/Contour/application/ContourService";
import PostmanTest from "./infrastructure/PostmanTest";

container.register("Postman", {
  useClass: PostmanTest,
});

test("Get WPS Contour form", () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
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
        "name": "Equidistancia",
        "element": "input",
        "type": "number",
        "min": 10,
        "max": 10000
      }
    ]`
  );
  expect(contourHandler.getFields()).toEqual(expectedFields);
});

test("Execute succesful WPS Contour", async () => {
  const postmanTest = new PostmanTest();
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );

  expect.assertions(1);
  const result = await contourHandler.execute(
    -69.84479,
    -34.17065,
    -69.82531,
    -34.15469,
    100
  );
  expect(result).toEqual(postmanTest.getResponseTest());
});

test("Execute succesful WPS Contour when request area touch higher and lower surface", async () => {
  const postmanTest = new PostmanTest();
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );

  expect.assertions(1);
  const result = await contourHandler.execute(
    -63.53331,
    -34.17846,
    -63.52048,
    -34.16922,
    10
  );
  expect(result).toEqual(postmanTest.getResponseTest());
});

test("Execute WPS Contour and get Coordinates Exception", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );

  expect.assertions(2);
  try {
    await contourHandler.execute(1, 1, 1, 1, 1);
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The latitud must be between -74 and -52");
  }
});

test("Execute WPS Contour and get Area Requested Exception", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );

  expect.assertions(2);
  try {
    await contourHandler.execute(
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

test("Execute WPS Contour and get Equidistance Range Exception in Higher Surface", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );

  expect.assertions(2);
  try {
    await contourHandler.execute(
      -69.28589006035278,
      -28.47228576296026,
      -69.28589006035277,
      -28.47228576296025,
      10
    );
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("Equidistance must be grather than 100");
  }
});

test("Execute WPS Contour and get Equidistance Range Exception in Lower Surface", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );

  expect.assertions(2);
  try {
    await contourHandler.execute(
      -60.37306160555501,
      -36.299503918476745,
      -58.792194242187236,
      -35.76065272730704,
      9
    );
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The equidistance must be between 10 and 10000");
  }
});
