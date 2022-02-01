import "reflect-metadata";

import { container } from "tsyringe";

import Level from "../../Shared/domain/Level";
import Polygon from "../../Shared/domain/Polygon";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import WaterRise from "../domain/WaterRise";
import WaterRiseTurfJSToleranceChecker from "../infraestructure/WaterRiseTurfJSToleranceChecker";
import WaterRiseService from "./WaterRiseService";

container.register("Postman", {
  useClass: PostmanHTTP,
});
container.register("WaterRiseToleranceChecker", {
  useClass: WaterRiseTurfJSToleranceChecker,
});

export default class WaterRiseHandler {
  private host: string;
  private service: WaterRiseService;
  constructor(host: string, service?: WaterRiseService) {
    this.host = host;
    if (service) {
      this.service = service;
    } else {
      this.service = container.resolve(WaterRiseService);
    }
  }

  getFields(): JSON {
    return this.service.getFields();
  }

  async execute(polygon: string, level: number): Promise<JSON> {
    const waterRise: WaterRise = new WaterRise(
      Polygon.createFromString(polygon),
      new Level(level),
      new wpsEndpoint(this.host)
    );

    return this.service.execute(waterRise);
  }
}
