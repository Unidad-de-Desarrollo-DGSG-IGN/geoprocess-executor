import Postman from "../../src/Shared/domain/Postman";

export default class ElevationProfilePostmanTest implements Postman {
  response = `
  {
    "type":"LineString",
    "coordinates": [
      [-69.89947669,-32.895181038,3744.307617188]
    ]
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
