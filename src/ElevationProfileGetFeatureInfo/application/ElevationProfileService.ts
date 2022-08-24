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

    let postmanResponse: any;
    // const points3D: Point3D[] = [];

    const promises = elevationProfile.linePoints.points.map(async (point) => {
      postmanResponse = await this.postman.get(
        elevationProfile.fullWmsEndpoint(point)
      );
      return new Point3D(
        point.longitude,
        point.latitude,
        new Height(
          Number(Object.values(postmanResponse.features[0].properties)[0])
        )
      );
    });

    const points3D = await Promise.all(promises);

    // return JSON.parse(new Line3D(points3D).toLineString3D());
    return this.formatResponse(points3D, responseType);
  }

  ensureInputDataIsInTolerance(elevationProfile: ElevationProfile): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(elevationProfile);
  }

  generateLine3DFromResponse(
    elevationProfile: ElevationProfile,
    postmanResponse: any
  ): Line3D {
    const featureCollection: GeoJson = postmanResponse;
    const points3D: Point3D[] = [];

    //Reorder the incomming features
    featureCollection.features.sort((firstFeature, secondFeature) => {
      if (
        firstFeature.properties.feature_index <
        secondFeature.properties.feature_index
      ) {
        return -1;
      }
      if (
        firstFeature.properties.feature_index >
        secondFeature.properties.feature_index
      ) {
        return 1;
      }
      return 0;
    });

    //Merge users points with incomming points
    elevationProfile.linePoints.points.forEach(function (point, index) {
      for (const featureKey in featureCollection.features) {
        if (
          featureCollection.features[featureKey].properties.feature_index ==
          index
        ) {
          points3D.push(
            new Point3D(
              point.longitude,
              point.latitude,
              new Height(
                featureCollection.features[index]["properties"][
                  elevationProfile.mdeLayerShortname + "_value"
                ]
              )
            )
          );
          break;
        }
      }
    });

    if (points3D.length == 1) {
      const point =
        elevationProfile.linePoints.points[
          elevationProfile.linePoints.points.length - 1
        ];
      points3D.push(
        new Point3D(
          point.longitude,
          point.latitude,
          new Height(
            featureCollection.features[0]["properties"][
              elevationProfile.mdeLayerShortname + "_value"
            ]
          )
        )
      );
    }

    return new Line3D(points3D);
  }

  formatResponse(
    points3D: Point3D[],
    responseType: ElevationProfileResponseType
  ): JSON {
    if (
      responseType === ElevationProfileResponseType.FeatureCollectionOfLines
    ) {
      return JSON.parse(new Line3D(points3D).toFeatureCollection());
    }

    return JSON.parse(new Line3D(points3D).toLineString3D());
  }
}
