import { inject, injectable } from "tsyringe";

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

    return this.formatResponse(postmanResponse, responseType);
  }

  ensureInputDataIsInTolerance(elevationProfile: ElevationProfile): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(elevationProfile);
  }

  geoJsonFeatureCollectionToLineString3D(featureCollection: GeoJson): JSON {
    const xyz: string[] = [];
    for (const featureKey in featureCollection.features) {
      //for (const coordinateKey in fc.features[featureKey].geometry.coordinates) {
      // console.log(fc.features[featureKey].geometry.coordinates[0][0]);
      // console.log(fc.features[featureKey].geometry.coordinates[0][1]);
      // console.log(fc.features[featureKey].properties.alos_unificado_value);
      xyz.push(`[
        ${featureCollection.features[featureKey].geometry.coordinates[0][0][0]},
        ${featureCollection.features[featureKey].geometry.coordinates[0][0][1]},
        ${featureCollection.features[featureKey].properties.alos_unificado_value}
      ]`);
      xyz.push(`[
        ${featureCollection.features[featureKey].geometry.coordinates[0][1][0]},
        ${featureCollection.features[featureKey].geometry.coordinates[0][1][1]},
        ${featureCollection.features[featureKey].properties.alos_unificado_value}
      ]`);
      //}
    }

    return JSON.parse(
      '{ "type": "LineString", "coordinates": [' + xyz.join(",") + "] }"
    );
  }

  replacePropertyHeightName(postmanResponse: any): JSON {
    return JSON.parse(
      JSON.stringify(postmanResponse).replace("alos_unificado_value", "height")
    );
  }

  formatResponse(
    postmanResponse: any,
    responseType: ElevationProfileResponseType
  ): JSON {
    if (
      responseType === ElevationProfileResponseType.FeatureCollectionOfLines
    ) {
      return this.replacePropertyHeightName(postmanResponse);
    }

    const featureCollection: GeoJson = postmanResponse;
    return this.geoJsonFeatureCollectionToLineString3D(featureCollection);
  }
}
