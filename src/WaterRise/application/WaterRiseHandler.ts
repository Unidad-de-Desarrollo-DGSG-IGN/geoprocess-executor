import "reflect-metadata";

import { container } from "tsyringe";

import LayerFullname from "../../Shared/domain/LayerFullname";
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
  private mdeLayerFullname: string;
  private service: WaterRiseService;
  constructor(
    host: string,
    mdeLayerFullname: string,
    service?: WaterRiseService
  ) {
    this.host = host;
    this.mdeLayerFullname = mdeLayerFullname;
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
    polygon: string,
    level: number,
    outputFormat = "image/png",
    areaBackgroundColor = "#FF0000",
    areaOpacity = 1.0
  ): Promise<Blob> {
    const waterRise: WaterRise = new WaterRise(
      Polygon.createFromString(polygon),
      new Level(level),
      new wpsEndpoint(this.host),
      new LayerFullname(this.mdeLayerFullname),
      outputFormat,
      areaBackgroundColor,
      areaOpacity
    );

    return this.service.execute(waterRise);
  }
}
