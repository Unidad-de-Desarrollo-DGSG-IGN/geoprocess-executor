import Equidistance from "../domain/Equidistance";
import Latitude from "../domain/Latitude";
import Longitude from "../domain/Longitude";
import PostmanHTTP from "../infrastructure/PostmanHTTP";
import ContourService from "./ContourService";

export default class ContourHandler {
  private service: ContourService;
  constructor(service?: ContourService) {
    if (service) {
      this.service = service;
    } else {
      this.service = new ContourService(new PostmanHTTP());
    }
  }

  getForm(): HTMLElement {
    return this.service.getForm();
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
      new Equidistance(equidistance)
    );
  }
}