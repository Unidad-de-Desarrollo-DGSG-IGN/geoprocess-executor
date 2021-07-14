import area from "@turf/area";
import { Feature, polygon } from "@turf/helpers";
import { injectable } from "tsyringe";

import Latitude from "../../Shared/domain/Latitude";
import Longitude from "../../Shared/domain/Longitude";
import WaterRise from "../domain/WaterRise";
import WaterRiseToleranceChecker from "../domain/WaterRiseToleranceChecker";

@injectable()
export default class WaterRiseTurfJSToleranceChecker
  implements WaterRiseToleranceChecker
{
  ensureInputDataIsInTolerance(waterRise: WaterRise): void {
    const inputPolygon = this.pointsToPolygon(
      waterRise.longitudeLower,
      waterRise.latitudeLower,
      waterRise.longitudeUpper,
      waterRise.latitudeUpper
    );

    if (area(inputPolygon) > WaterRise.MAX_AREA_ALLOWED) {
      throw RangeError("The area requested must be less than 100km2");
    }
  }

  pointsToPolygon(
    longitudeLower: Longitude, //x2
    latitudeLower: Latitude, //y2
    longitudeUpper: Longitude, //x1
    latitudeUpper: Latitude //y1
  ): Feature {
    const x = polygon([
      [
        [longitudeUpper.value, latitudeUpper.value], //x1y1
        [longitudeUpper.value, latitudeLower.value], //x1y2
        [longitudeLower.value, latitudeLower.value], //x2y2
        [longitudeLower.value, latitudeUpper.value], //x2y1
        [longitudeUpper.value, latitudeUpper.value], //x1y1
      ],
    ]);

    return x;
  }
}
