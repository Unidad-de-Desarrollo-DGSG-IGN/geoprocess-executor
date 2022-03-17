import { point } from "@turf/helpers";
import { inject, injectable } from "tsyringe";
import Height from "../../Shared/domain/Height";
import Line3D from "../../Shared/domain/Line3D";
import Point3D from "../../Shared/domain/Point3D";

import Postman from "../../Shared/domain/Postman";
import ElevationProfile from "../domain/ElevationProfile";
import ElevationProfileToleranceChecker from "../domain/ElevationProfileToleranceChecker";
import { GeoJson } from "../domain/GeoJsonFeatureCollectionOfLines";
import { ElevationProfileResponseType } from "./ElevationProfileResponseType";

@injectable()
export default class ElevationProfileService {
  private postman: Postman;
  private tolaranceChecker: ElevationProfileToleranceChecker;
  constructor(
    @inject("Postman") postman: Postman,
    @inject("ElevationProfileToleranceChecker")
    toleranceChecker: ElevationProfileToleranceChecker
  ) {
    this.postman = postman;
    this.tolaranceChecker = toleranceChecker;
  }

  getFields(): JSON {
    return ElevationProfile.FIELDS;
  }

  async execute(
    elevationProfile: ElevationProfile,
    responseType: ElevationProfileResponseType
  ): Promise<JSON> {
    this.ensureInputDataIsInTolerance(elevationProfile);
    const postmanResponse: any = await this.postman.post(
      elevationProfile.fullWpsEndpoint,
      elevationProfile.xmlInput
    );
    
    const line3D: Line3D = this.generateLine3DFromResponse(elevationProfile, postmanResponse);
    return this.formatResponse(line3D, responseType);
  }

  ensureInputDataIsInTolerance(elevationProfile: ElevationProfile): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(elevationProfile);
  }

  generateLine3DFromResponse(elevationProfile: ElevationProfile, postmanResponse: any): Line3D {
    const featureCollection: GeoJson = postmanResponse;
    let points3D: Point3D[] = [];

    elevationProfile.linePoints.points.forEach(function (point, index) {
      for (const featureKey in featureCollection.features) {
        if (featureCollection.features[featureKey].properties.feature_index == index) {
          points3D.push(new Point3D(point.longitude, point.latitude, new Height(featureCollection.features[index].properties.alos_unificado_value)));
          break;
        }
      }
    });

    return new Line3D(points3D);
  }

  formatResponse(
    line3D: Line3D,
    responseType: ElevationProfileResponseType
  ): JSON {
    if (
      responseType === ElevationProfileResponseType.FeatureCollectionOfLines
    ) {
      return JSON.parse(line3D.toFeatureCollection());
    }

    return JSON.parse(line3D.toLineString3D());
  }
}
