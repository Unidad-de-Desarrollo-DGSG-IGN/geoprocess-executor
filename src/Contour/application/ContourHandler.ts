import "reflect-metadata";

import { container } from "tsyringe";

import Equidistance from "../../Shared/domain/Equidistance";
import Latitude from "../../Shared/domain/Latitude";
import Longitude from "../../Shared/domain/Longitude";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import Contour from "../domain/Contour";
import TurfJSContourToleranceChecker from "../infraestructure/ContourTurfJSToleranceChecker";
import ContourService from "./ContourService";

container.register("Postman", {
  useClass: PostmanHTTP,
});
container.register("ContourToleranceChecker", {
  useClass: TurfJSContourToleranceChecker,
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
    const contour: Contour = new Contour(
      new Longitude(longitudeLower),
      new Latitude(latitudeLower),
      new Longitude(longitudeUpper),
      new Latitude(latitudeUpper),
      new Equidistance(equidistance),
      new wpsEndpoint(this.host)
    );

    return this.service.execute(contour);
  }
}
