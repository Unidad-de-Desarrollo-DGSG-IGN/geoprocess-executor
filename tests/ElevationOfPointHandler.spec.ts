import "reflect-metadata";

import { container } from "tsyringe";

import ElevationOfPointHandler from "../src/ElevationOfPoint/application/ElevationOfPointHandler";
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
    "http://172.20.201.37/geoprocess-backend/elevation-profile",
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

test("Execute succesful Elevation of Point", async () => {
  const postmanTest = new ElevationOfPointPostmanTest();
  const elevationOfPointHandler = new ElevationOfPointHandler(
    "http://172.20.201.37/geoprocess-backend/elevation-profile",
    container.resolve(ElevationOfPointService)
  );

  expect.assertions(1);
  const result = await elevationOfPointHandler.execute(
    "-69.8994766897101 -32.895181037843"
  );
  expect(result).toEqual(postmanTest.getResponseTest());
});

test("Execute Elevation of Point and get Coordinates Exception", async () => {
  const elevationOfPointHandler = new ElevationOfPointHandler(
    "http://172.20.201.37/geoprocess-backend/elevation-profile",
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

// test("Execute Elevation of Point and get Line Lenght Exception", async () => {
//   const elevationOfPointHandler = new ElevationOfPointHandler(
//     "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
//     container.resolve(ElevationOfPointService)
//   );

//   expect.assertions(2);
//   try {
//     await elevationOfPointHandler.execute(
//       "-62.781702786449884 -26.24742367352862"
//     );
//   } catch (e) {
//     expect(e instanceof RangeError).toBeTruthy();
//     expect(e.message).toEqual(
//       "The line length requested must be less than 100km"
//     );
//   }
// });
