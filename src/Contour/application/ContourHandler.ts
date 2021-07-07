import "reflect-metadata";

import { container } from "tsyringe";

import Equidistance from "../../Shared/domain/Equidistance";
import Latitude from "../../Shared/domain/Latitude";
import Longitude from "../../Shared/domain/Longitude";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import TurfJSToleranceChecker from "../infraestructure/TurfJSToleranceChecker";
import ContourService from "./ContourService";

container.register("Postman", {
  useClass: PostmanHTTP,
});
container.register("ToleranceChecker", {
  useClass: TurfJSToleranceChecker,
});

export default class ContourHandler {
  private host: string;
  private service: ContourService;
  constructor(host: string, service?: ContourService) {
    this.host = host;
    if (service) {
      this.service = service;
    } else {
      this.service = container.resolve(ContourService);
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
