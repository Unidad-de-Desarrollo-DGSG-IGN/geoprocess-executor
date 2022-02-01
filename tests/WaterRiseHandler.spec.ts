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
    `-69.696212581553127 -34.207204894110262, -69.799409776448044 -34.220104543472132,
     -69.799789090436576 -34.110482800785661, -69.717829710947697 -34.13467138556318,
     -69.696212581553127 -34.207204894110262`,
    2000
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
    `-69.668597867933173 -28.994841392095232, -69.668412565767639 -29.00114166572347,
     -69.663780011629228 -29.000771061392399, -69.66470652245691 -28.998362133240423,
     -69.665262428953511 -28.996323809419525, -69.668597867933173 -28.994841392095232`,
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
    await waterRiseHandler.execute(
      `-55.403388607360576 -17.91330863760378, -55.403666560608883 -17.915254310341915,
       -55.401164981374144 -17.915254310341915, -55.40213781774321 -17.914281473972846,
       -55.403388607360576 -17.91330863760378`,
      1
    );
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The latitud must be between -84 and -20");
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
      `-69.715309866220068 -28.956889743810848, -69.547023794769601 -28.961797882812281,
       -69.569461937629654 -29.099131215641659, -69.709700330505044 -29.010866471301313,
       -69.715309866220068 -28.956889743810848`,
      100
    );
  } catch (e) {
    expect(e instanceof RangeError).toBeTruthy();
    expect(e.message).toEqual("The area requested must be less than 100km2");
  }
});
