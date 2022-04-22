import { inject, injectable } from "tsyringe";

import Postman from "../../Shared/domain/Postman";
import ElevationOfPoint from "../domain/ElevationOfPoint";
import ElevationOfPointToleranceChecker from "../domain/ElevationOfPointToleranceChecker";
import { ElevationOfPointResponseType } from "./ElevationOfPointResponseType";

@injectable()
export default class ElevationOfPointService {
  private postman: Postman;
  private tolaranceChecker: ElevationOfPointToleranceChecker;
  constructor(
    @inject("Postman") postman: Postman,
    @inject("ElevationOfPointToleranceChecker")
    toleranceChecker: ElevationOfPointToleranceChecker
  ) {
    this.postman = postman;
    this.tolaranceChecker = toleranceChecker;
  }

  getFields(): JSON {
    return ElevationOfPoint.FIELDS;
  }

  async execute(
    elevationOfPoint: ElevationOfPoint,
    responseType: ElevationOfPointResponseType
  ): Promise<JSON> {
    this.ensureInputDataIsInTolerance(elevationOfPoint);

    const postmanResponse: any = await this.postman.post(
      elevationOfPoint.wpsEndpoint.value,
      elevationOfPoint.xmlInput
    );

    return this.formatResponse(elevationOfPoint, postmanResponse, responseType);
  }

  ensureInputDataIsInTolerance(elevationOfPoint: ElevationOfPoint): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(elevationOfPoint);
  }

  postmanResponseToPoint3D(
    elevationOfPoint: ElevationOfPoint,
    postmanResponse: any
  ): JSON {
    const point2D: string = elevationOfPoint.toString;
    return JSON.parse(
      '{ "type": "Point", "coordinates": [' +
        point2D +
        "," +
        postmanResponse.features[0]["properties"][
          elevationOfPoint.mdeLayerShortname + "_value"
        ] +
        "] }"
    );
  }

  postmanResponseToFeatureCollection(
    elevationOfPoint: ElevationOfPoint,
    postmanResponse: any
  ): JSON {
    const point2D: string = elevationOfPoint.toString;
    return JSON.parse(
      `{
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                ${point2D}
              ]
            },
            "properties": {
              "height": ${
                postmanResponse.features[0]["properties"][
                  `${elevationOfPoint.mdeLayerShortname}_value`
                ]
              }
            },
            "id": "0"
          }
        ]
      }`
    );
  }

  formatResponse(
    elevationOfPoint: ElevationOfPoint,
    postmanResponse: any,
    responseType: ElevationOfPointResponseType
  ): JSON {
    const point2D: string = elevationOfPoint.toString;
    if (
      responseType === ElevationOfPointResponseType.FeatureCollectionOfPoint
    ) {
      return this.postmanResponseToFeatureCollection(
        elevationOfPoint,
        postmanResponse
      );
    }

    return this.postmanResponseToPoint3D(elevationOfPoint, postmanResponse);
  }
}
