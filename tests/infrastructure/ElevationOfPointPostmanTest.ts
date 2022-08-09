import Postman from "../../src/Shared/domain/Postman";

export default class ElevationOfPointPostmanTest implements Postman {
  response3DPoint = `
  {
    "type":"Point",
    "coordinates": [
      -69.8994766897101,-32.895181037843,3744.307617188
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
          "type": "MultiPoint",
          "coordinates": [
            [
              [
                -69.8994766897101,
                -32.895181037843
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
          "type": "Point",
          "coordinates": [
            -69.8994766897101,
            -32.895181037843
          ]
        },
        "properties": {
          "height": 3744.307617188
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
  async postReturningBlob(url: string, content: string): Promise<Blob> {
    url;
    content;
    return new Blob();
  }
  async get(url: string): Promise<JSON> {
    url;
    return JSON.parse(""); // parses JSON response into native JavaScript objects
  }
  getResponseTestWith3DPointResponse(): JSON {
    return JSON.parse(this.response3DPoint);
  }
  getResponseTestWithFeatureCollectionResponse(): JSON {
    return JSON.parse(this.responseFeatureCollection);
  }
  getResponseTestWithFeatureCollectionWithHeightPropertyResponse(): JSON {
    return JSON.parse(this.responseFeatureCollectionWithHeightProperty);
  }
}
