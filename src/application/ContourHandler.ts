import Equidistance from "../domain/Equidistance";
import Latitude from "../domain/Latitude";
import Longitude from "../domain/Longitude";
import wpsEndpoint from "../domain/WPSEndpoint";
import PostmanHTTP from "../infrastructure/PostmanHTTP";
import ContourService from "./ContourService";

export default class ContourHandler {
  private host: string;
  private service: ContourService;
  constructor(host: string, service?: ContourService) {
    this.host = host;
    if (service) {
      this.service = service;
    } else {
      this.service = new ContourService(new PostmanHTTP());
    }
  }

  getFields(): JSON {
    return this.service.getFields();
  }

  async execute(
    longitudeLower: number,
    latitudeLower: number,
    longitudeUpper: number,
    latitudeUpper: number,
    equidistance: number
  ): Promise<JSON> {
    return this.service.execute(
      new Longitude(longitudeLower),
      new Latitude(latitudeLower),
      new Longitude(longitudeUpper),
      new Latitude(latitudeUpper),
      new Equidistance(equidistance),
      new wpsEndpoint(this.host)
    );
  }
}
