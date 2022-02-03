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

    return this.formatResponse(
      elevationOfPoint.toString,
      postmanResponse,
      responseType
    );
  }

  ensureInputDataIsInTolerance(elevationOfPoint: ElevationOfPoint): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(elevationOfPoint);
  }

  postmanResponseToPoint3D(point2D: string, postmanResponse: any): JSON {
    return JSON.parse(
      '{ "type": "Point", "coordinates": [' +
        point2D +
        "," +
        postmanResponse.features[0].properties.alos_unificado_value +
        "] }"
    );
  }

  postmanResponseToFeatureCollection(
    point2D: string,
    postmanResponse: any
  ): JSON {
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
              "height": ${postmanResponse.features[0].properties.alos_unificado_value}
            },
            "id": "0"
          }
        ]
      }`
    );
  }

  formatResponse(
    point2D: string,
    postmanResponse: any,
    responseType: ElevationOfPointResponseType
  ): JSON {
    if (
      responseType === ElevationOfPointResponseType.FeatureCollectionOfPoint
    ) {
      return this.postmanResponseToFeatureCollection(point2D, postmanResponse);
    }

    return this.postmanResponseToPoint3D(point2D, postmanResponse);
  }
}
