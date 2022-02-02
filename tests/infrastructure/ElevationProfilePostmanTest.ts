import Postman from "../../src/Shared/domain/Postman";

export default class ElevationProfilePostmanTest implements Postman {
  response3DLineString = `
  {
    "type":"LineString",
    "coordinates": [
      [-69.89947669,-32.895181038,3744.307617188],
      [-69.89547669,-32.895131038,3744.307617188]
    ]
  }
  `;
  responseFeatureCollection = `
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "MultiLineString",
          "coordinates": [
            [
              [
                -69.89947669,
                -32.895181038
              ],
              [
                -69.89547669,
                -32.895131038
              ]
            ]
          ]
        },
        "properties": {
          "alos_unificado_value": 3744.307617188,
          "INTERSECTION_ID": 0
        },
        "id": "0"
      }
    ]
  }
  `;

  responseFeatureCollectionWithHeightProperty = `
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "MultiLineString",
          "coordinates": [
            [
              [
                -69.89947669,
                -32.895181038
              ],
              [
                -69.89547669,
                -32.895131038
              ]
            ]
          ]
        },
        "properties": {
          "height": 3744.307617188,
          "INTERSECTION_ID": 0
        },
        "id": "0"
      }
    ]
  }
  `;
  async post(url: string, content: string): Promise<JSON> {
    url;
    content;
    return JSON.parse(this.responseFeatureCollection); // parses JSON response into native JavaScript objects
  }
  getResponseTestWith3DLineStringResponse(): JSON {
    return JSON.parse(this.response3DLineString);
  }
  getResponseTestWithFeatureCollectionResponse(): JSON {
    return JSON.parse(this.responseFeatureCollection);
  }
  getResponseTestWithFeatureCollectionWithHeightPropertyResponse(): JSON {
    return JSON.parse(this.responseFeatureCollectionWithHeightProperty);
  }
}
