import "reflect-metadata";

import { container } from "tsyringe";

import Equidistance from "../../Shared/domain/Equidistance";
import Latitude from "../../Shared/domain/Latitude";
import Longitude from "../../Shared/domain/Longitude";
import Polygon from "../../Shared/domain/Polygon";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import Contour from "../domain/Contour";
import ContourV2 from "../domain/ContourV2";
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

  async executeV2(polygon: string, equidistance: number): Promise<JSON> {
    const contour: ContourV2 = new ContourV2(
      Polygon.createFromString(polygon),
      new Equidistance(equidistance),
      new wpsEndpoint(this.host)
    );

    return this.service.executeV2(contour);
  }
}
