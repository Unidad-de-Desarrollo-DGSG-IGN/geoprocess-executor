import { feature } from "@turf/helpers";
import length from "@turf/length";
import { injectable } from "tsyringe";

import ElevationProfile from "../domain/ElevationProfile";
import ElevationProfileToleranceChecker from "../domain/ElevationProfileToleranceChecker";

@injectable()
export default class TurfJSElevationProfileToleranceChecker
  implements ElevationProfileToleranceChecker
{
  ensureInputDataIsInTolerance(elevationProfile: ElevationProfile): void {
    const geometry = JSON.parse(`
      {
        "type": "LineString",
        "coordinates": [${elevationProfile.line.toString()}]
      }`);
    const line = feature(geometry);

    if (length(line, { units: "kilometers" }) > 100) {
      throw RangeError("The line length requested must be less than 100km");
    }
  }
}
