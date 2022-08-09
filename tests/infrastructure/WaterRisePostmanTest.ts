import Postman from "../../src/Shared/domain/Postman";

export default class WaterRisePostmanTest implements Postman {
  response = `
  {
    "type":"FeatureCollection",
    "features":[
       {
          "type":"Feature",
          "geometry":{
             "type":"Polygon",
             "coordinates":[
                [
                   [
                      -69.7657,
                      -34.1284
                   ],
                   [
                      -69.7657,
                      -34.1279
                   ],
                   [
                      -69.766,
                      -34.1279
                   ],
                   [
                      -69.7654,
                      -34.1309
                   ],
                   [
                      -69.7654,
                      -34.1284
                   ],
                   [
                      -69.7657,
                      -34.1284
                   ]
                ]
             ]
          },
          "properties":{
             "value":1.0
          },
          "id":"4"
       },
       {
          "type":"Feature",
          "geometry":{
             "type":"Polygon",
             "coordinates":[
                [
                   [
                      -69.7657,
                      -34.1966
                   ],
                   [
                      -69.766,
                      -34.1966
                   ],
                   [
                      -69.766,
                      -34.1971
                   ],
                   [
                      -69.7657,
                      -34.1971
                   ],
                   [
                      -69.7657,
                      -34.1961
                   ],
                   [
                      -69.7657,
                      -34.1966
                   ]
                ]
             ]
          },
          "properties":{
             "value":1.0
          },
          "id":"5"
       }
    ]
 }
 `;
  async post(url: string, content: string): Promise<JSON> {
    url;
    content;
    return JSON.parse(this.response); // parses JSON response into native JavaScript objects
  }
  async postReturningBlob(url: string, content: string): Promise<Blob> {
    url;
    content;
    return new Blob();
  }
  async get(url: string): Promise<JSON> {
    url;
    return JSON.parse(this.response); // parses JSON response into native JavaScript objects
  }
  getResponseTest(): Blob {
    // return JSON.parse(this.response);
    return new Blob();
  }
}
