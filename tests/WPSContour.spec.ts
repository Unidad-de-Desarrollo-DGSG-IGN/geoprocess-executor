// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom/extend-expect";

import { getByText } from "@testing-library/dom";

import { WPSContour } from "../src/WPSContour";
import { PostmanTest } from "./infrastructure/PostmanTest";

test("Execute WPS Contour", async () => {
  const postmanTest = new PostmanTest();
  const wpsContour = new WPSContour(postmanTest);
  const inputParameters = JSON.parse(`{
        "longitudeLower": "1",
        "latitudeLower": "1",
        "longitudeUpper": "1",
        "latitudeUpper": "1",
        "equidistance": "1"
    }`);

  expect(await wpsContour.execute(inputParameters)).toEqual(postmanTest.getResponseTest());
});
