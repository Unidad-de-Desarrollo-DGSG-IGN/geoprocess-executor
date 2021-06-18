// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom/extend-expect";

import ContourHandler from "../src/application/ContourHandler";
import ContourService from "../src/application/ContourService";
import PostmanTest from "./infrastructure/PostmanTest";

test("Get WPS Contour form", () => {
  const postmanTest = new PostmanTest();
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    new ContourService(postmanTest)
  );
  const expectedForm = document.createElement("div");
  expectedForm.innerHTML = `<label for="latitudeLower">latitudeLower</label>`;
  expectedForm.innerHTML += `<input type="text" name="latitudeLower" id="latitudeLower"></input>`;
  expectedForm.innerHTML += `<label for="longitudeLower">longitudeLower</label>`;
  expectedForm.innerHTML += `<input type="text" name="longitudeLower" id="longitudeLower"></input>`;
  expectedForm.innerHTML += `<label for="latitudeUpper">latitudeUpper</label>`;
  expectedForm.innerHTML += `<input type="text" name="latitudeUpper" id="latitudeUpper"></input>`;
  expectedForm.innerHTML += `<label for="longitudeUpper">longitudeUpper</label>`;
  expectedForm.innerHTML += `<input type="text" name="longitudeUpper" id="longitudeUpper"></input>`;
  expectedForm.innerHTML += `<label for="equidistance">equidistance</label>`;
  expectedForm.innerHTML += `<input type="text" name="equidistance" id="equidistance"></input>`;
  expect(contourHandler.getForm()).toEqual(expectedForm);
});

test("Execute succesful WPS Contour", async () => {
  const postmanTest = new PostmanTest();
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    new ContourService(postmanTest)
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
  const postmanTest = new PostmanTest();
  const contourHandler = new ContourHandler(
    "http://127.0.0.1:8080/geoserver/ows?service=WPS&version=1.0.0",
    new ContourService(postmanTest)
  );
  expect(
    async () => await contourHandler.execute(1, 1, 1, 1, 1)
  ).rejects.toThrow(RangeError);
  expect(
    async () => await contourHandler.execute(1, 1, 1, 1, 1)
  ).rejects.toThrow("The latitud must be between -74 and -52");
});
