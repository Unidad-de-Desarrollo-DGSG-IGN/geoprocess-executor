// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom/extend-expect";

import WPSFactory from "../src/index";

test("Get WPS Contour form", () => {
  const factory = new WPSFactory();
  const wps = factory.createWPS("countour");
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
  expect(wps.getForm()).toEqual(expectedForm);
});

test("Get Exception on Create", () => {
  const factory = new WPSFactory();
  expect(() => factory.createWPS("")).toThrow(TypeError);
  expect(() => factory.createWPS("")).toThrow("Invalid WPS name");
});
