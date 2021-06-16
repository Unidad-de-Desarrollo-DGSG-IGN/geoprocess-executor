import Postman from "../../src/domain/Postman";

export default class PostmanTest implements Postman {
  response = `
    {
     "type":"FeatureCollection",
     "features":[{
         "type":"Feature",
         "geometry":{
             "type":"LineString","coordinates":[
                 [-69.8447,-34.1692],
                 [-69.8445,-34.1693]
                ]
          },
          "properties":{"value":5200.0},
          "id":"9"
      }]
    }
  `;
  async post(url: string, content: string): Promise<JSON> {
    url;
    content;
    return JSON.parse(this.response); // parses JSON response into native JavaScript objects
  }
  getResponseTest(): JSON {
    return JSON.parse(this.response);
  }
}
