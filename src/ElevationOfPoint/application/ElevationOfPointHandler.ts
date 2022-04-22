import "reflect-metadata";

import { container } from "tsyringe";

import LayerFullname from "../../Shared/domain/LayerFullname";
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
  private mdeLayerFullname: string;
  private service: ElevationOfPointService;
  constructor(
    host: string,
    mdeLayerFullname: string,
    service?: ElevationOfPointService
  ) {
    this.host = host;
    this.mdeLayerFullname = mdeLayerFullname;
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
      new wpsEndpoint(this.host),
      new LayerFullname(this.mdeLayerFullname)
    );

    return this.service.execute(elevationOfPoint, responseType);
  }
}
