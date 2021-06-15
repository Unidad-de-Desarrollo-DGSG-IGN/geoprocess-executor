// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom/extend-expect";

import WPSFactory from "../src/index";

test("Get WPS Contour form", () => {
  const factory = new WPSFactory();
  const wps = factory.createWPS("countour");
  const expectedFrm = document.createElement("div");
  expectedFrm.innerHTML = '<label for="latitudeLower">latitudeLower</label>';
  expectedFrm.innerHTML += `
    <input type="text" name="latitudeLower" id="latitudeLower"></input>
  `;
  expectedFrm.innerHTML += '<label for="longitudeLower">longitudeLower</label>';
  expectedFrm.innerHTML += `
    <input type="text" name="longitudeLower" id="longitudeLower"></input>
  `;
  expectedFrm.innerHTML += '<label for="latitudeUpper">latitudeUpper</label>';
  expectedFrm.innerHTML += `
    <input type="text" name="latitudeUpper" id="latitudeUpper"></input>
  `;
  expectedFrm.innerHTML += '<label for="longitudeUpper">longitudeUpper</label>';
  expectedFrm.innerHTML += `
    <input type="text" name="longitudeUpper" id="longitudeUpper"></input>
  `;
  expectedFrm.innerHTML += '<label for="equidistance">equidistance</label>';
  expectedFrm.innerHTML += `
    <input type="text" name="equidistance" id="equidistance"></input>
  `;
  expect(wps.getForm()).toEqual(expectedFrm);
});

test("Get Exception on Create", () => {
  const factory = new WPSFactory();
  expect(() => factory.createWPS("")).toThrow(TypeError);
  expect(() => factory.createWPS("")).toThrow("Invalid WPS name");
});
