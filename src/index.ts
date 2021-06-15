import { PostmanHTTP } from "./infrastructure/PostmanHTTP";
import { WPS } from "./WPS";
import { WPSContour } from "./WPSContour";

export default class WPSFactory {
  createWPS(wpsName: string): WPS {
    switch (wpsName) {
      case "countour":
        return new WPSContour(new PostmanHTTP());
      default:
        throw new TypeError("Invalid WPS name");
    }
  }
}
