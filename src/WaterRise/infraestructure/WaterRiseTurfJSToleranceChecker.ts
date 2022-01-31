import area from "@turf/area";
import { Feature, polygon } from "@turf/helpers";
import { injectable } from "tsyringe";

import Polygon from "../../Shared/domain/Polygon";
import WaterRise from "../domain/WaterRise";
import WaterRiseToleranceChecker from "../domain/WaterRiseToleranceChecker";

@injectable()
export default class WaterRiseTurfJSToleranceChecker
  implements WaterRiseToleranceChecker
{
  ensureInputDataIsInTolerance(waterRise: WaterRise): void {
    const inputPolygon = this.pointsToPolygon(waterRise.polygon);

    if (area(inputPolygon) > WaterRise.MAX_AREA_ALLOWED) {
      throw RangeError("The area requested must be less than 100km2");
    }
  }

  pointsToPolygon(_polygon: Polygon): Feature {
    const x = polygon(_polygon.coordinates());

    return x;
  }
}
