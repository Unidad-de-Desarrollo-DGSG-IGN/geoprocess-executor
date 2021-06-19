import "reflect-metadata";

import { container } from "tsyringe";

import ContourHandler from "../src/application/ContourHandler";
import ContourService from "../src/application/ContourService";
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
        "type": "select",
        "references": "drawedLayers",
        "allowedTypes": ["rectangle"],
        "points": ["ne", "sw"]
      },
      {
        "name": "Equidistancia",
        "type": "integer",
        "min": 100,
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

test("Execute WPS Contour and get Exception", async () => {
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
