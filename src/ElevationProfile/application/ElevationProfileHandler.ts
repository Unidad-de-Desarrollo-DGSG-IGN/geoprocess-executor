import "reflect-metadata";

import { container } from "tsyringe";

import Line from "../../Shared/domain/Line";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import ElevationProfile from "../domain/ElevationProfile";
import TurfJSElevationProfileToleranceChecker from "../infraestructure/TurfJSElevationProfileToleranceChecker";
import { ElevationProfileResponseType } from "./ElevationProfileResponseType";
import ElevationProfileService from "./ElevationProfileService";

container.register("Postman", {
  useClass: PostmanHTTP,
});
container.register("ElevationProfileToleranceChecker", {
  useClass: TurfJSElevationProfileToleranceChecker,
});

export default class ElevationProfileHandler {
  private host: string;
  private service: ElevationProfileService;
  constructor(host: string, service?: ElevationProfileService) {
    this.host = host;
    if (service) {
      this.service = service;
    } else {
      this.service = container.resolve(ElevationProfileService);
    }
  }

  getFields(): JSON {
    return this.service.getFields();
  }

  async execute(
    line: string,
    responseType = ElevationProfileResponseType.LineString3D
  ): Promise<JSON> {
    const elevationProfile: ElevationProfile = new ElevationProfile(
      Line.createFromString(line),
      new wpsEndpoint(this.host)
    );

    return this.service.execute(elevationProfile, responseType);
  }
}
