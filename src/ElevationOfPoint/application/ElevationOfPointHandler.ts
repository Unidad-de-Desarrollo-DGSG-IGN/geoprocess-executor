import "reflect-metadata";

import { container } from "tsyringe";

import Point from "../../Shared/domain/Point";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import ElevationOfPoint from "../domain/ElevationOfPoint";
import TurfJSElevationOfPointToleranceChecker from "../infraestructure/TurfJSElevationOfPointToleranceChecker";
import { ElevationOfPointResponseType } from "./ElevationOfPointResponseType";
import ElevationOfPointService from "./ElevationOfPointService";

container.register("Postman", {
  useClass: PostmanHTTP,
});
container.register("ElevationOfPointToleranceChecker", {
  useClass: TurfJSElevationOfPointToleranceChecker,
});

export default class ElevationOfPointHandler {
  private host: string;
  private service: ElevationOfPointService;
  constructor(host: string, service?: ElevationOfPointService) {
    this.host = host;
    if (service) {
      this.service = service;
    } else {
      this.service = container.resolve(ElevationOfPointService);
    }
  }

  getFields(): JSON {
    return this.service.getFields();
  }

  async execute(
    point: string,
    responseType = ElevationOfPointResponseType.Point3D
  ): Promise<JSON> {
    const elevationOfPoint: ElevationOfPoint = new ElevationOfPoint(
      Point.createFromString(point),
      new wpsEndpoint(this.host)
    );

    return this.service.execute(elevationOfPoint, responseType);
  }
}
