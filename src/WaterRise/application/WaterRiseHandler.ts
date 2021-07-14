import "reflect-metadata";

import { container } from "tsyringe";

import Latitude from "../../Shared/domain/Latitude";
import Level from "../../Shared/domain/Level";
import Longitude from "../../Shared/domain/Longitude";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import WaterRise from "../domain/WaterRise";
import WaterRiseTurfJSToleranceChecker from "../infraestructure/WaterRiseTurfJSToleranceChecker";
import WaterRiseService from "./WaterRiseService";

container.register("Postman", {
  useClass: PostmanHTTP,
});
container.register("ToleranceChecker", {
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

  async execute(
    longitudeLower: number,
    latitudeLower: number,
    longitudeUpper: number,
    latitudeUpper: number,
    level: number
  ): Promise<JSON> {
    const waterRise: WaterRise = new WaterRise(
      new Longitude(longitudeLower),
      new Latitude(latitudeLower),
      new Longitude(longitudeUpper),
      new Latitude(latitudeUpper),
      new Level(level),
      new wpsEndpoint(this.host)
    );

    return this.service.execute(waterRise);
  }
}