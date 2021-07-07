import "reflect-metadata";

import { container } from "tsyringe";

import ContourHandler from "../src/Contour/application/ContourHandler";
import ContourService from "../src/Contour/application/ContourService";
import TurfJSToleranceChecker from "../src/Contour/infraestructure/TurfJSToleranceChecker";
import PostmanTest from "./infrastructure/PostmanTest";

container.register("Postman", {
  useClass: PostmanTest,
});
container.register("ToleranceChecker", {
  useClass: TurfJSToleranceChecker,
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
  expect(
    await contourHandler.execute(
      -69.84479,
      -34.17065,
      -69.82531,
      -34.15469,
      100
    )
  ).toEqual(postmanTest.getResponseTest());
});

test("Execute succesful WPS Contour when request area touch higher and lower surface", async () => {
  const postmanTest = new PostmanTest();
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );
  expect(
    await contourHandler.execute(-63.53331, -34.17846, -63.52048, -34.16922, 10)
  ).toEqual(postmanTest.getResponseTest());
});

test("Execute WPS Contour and get Coordinates Exception", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );
  expect(
    async () => await contourHandler.execute(1, 1, 1, 1, 1)
  ).rejects.toThrow(RangeError);
  expect(
    async () => await contourHandler.execute(1, 1, 1, 1, 1)
  ).rejects.toThrow("The latitud must be between -74 and -52");
});

test("Execute WPS Contour and get Area Requested Exception", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );
  expect(
    async () =>
      await contourHandler.execute(
        -63.68053,
        -34.02598,
        -63.22427,
        -33.82642,
        100
      )
  ).rejects.toThrow(RangeError);
  expect(
    async () =>
      await contourHandler.execute(
        -63.68053,
        -34.02598,
        -63.22427,
        -33.82642,
        100
      )
  ).rejects.toThrow("The area requested must be less than 100km2");
});

test("Execute WPS Contour and get Equidistance Range Exception in Higher Surface", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );
  expect(
    async () =>
      await contourHandler.execute(
        -69.28589006035278,
        -28.47228576296026,
        -68.81897111654268,
        -28.16279458245836,
        10
      )
  ).rejects.toThrow(RangeError);
  expect(
    async () =>
      await contourHandler.execute(
        -69.28589006035278,
        -28.47228576296026,
        -68.81897111654268,
        -28.16279458245836,
        10
      )
  ).rejects.toThrow("Equidistance must be grather than 100");
});

test("Execute WPS Contour and get Equidistance Range Exception in Lower Surface", async () => {
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    container.resolve(ContourService)
  );
  expect(
    async () =>
      await contourHandler.execute(
        -60.37306160555501,
        -36.299503918476745,
        -58.792194242187236,
        -35.76065272730704,
        9
      )
  ).rejects.toThrow(RangeError);
  expect(
    async () =>
      await contourHandler.execute(
        -69.28589006035278,
        -28.47228576296026,
        -68.81897111654268,
        -28.16279458245836,
        9
      )
  ).rejects.toThrow("Equidistance must be grather than 10");
});
