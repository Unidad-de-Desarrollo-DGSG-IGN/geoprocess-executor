import { feature } from "@turf/helpers";
import length from "@turf/length";
import { injectable } from "tsyringe";

import ElevationOfPoint from "../domain/ElevationOfPoint";
import ElevationOfPointToleranceChecker from "../domain/ElevationOfPointToleranceChecker";

@injectable()
export default class TurfJSElevationOfPointToleranceChecker
  implements ElevationOfPointToleranceChecker
{
  ensureInputDataIsInTolerance(elevationOfPoint: ElevationOfPoint): void {
    const geometry = JSON.parse(`
      {
        "type": "Point",
        "coordinates": [${elevationOfPoint.point.toString}]
      }`);
    const line = feature(geometry);

    if (length(line, { units: "kilometers" }) > 100) {
      throw RangeError("The line length requested must be less than 100km");
    }
  }
}
