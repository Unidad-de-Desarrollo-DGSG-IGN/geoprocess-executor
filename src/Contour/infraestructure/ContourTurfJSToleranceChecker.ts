import area from "@turf/area";
import booleanContains from "@turf/boolean-contains";
import { Feature, polygon } from "@turf/helpers";
import { injectable } from "tsyringe";

import Latitude from "../../Shared/domain/Latitude";
import Longitude from "../../Shared/domain/Longitude";
import Contour from "../domain/Contour";
import ContourToleranceChecker from "../domain/ContourToleranceChecker";

@injectable()
export default class ContourTurfJSToleranceChecker
  implements ContourToleranceChecker
{
  ensureInputDataIsInTolerance(contour: Contour): void {
    const inputPolygon = this.pointsToPolygon(
      contour.longitudeLower,
      contour.latitudeLower,
      contour.longitudeUpper,
      contour.latitudeUpper
    );

    if (area(inputPolygon) > Contour.MAX_AREA_ALLOWED) {
      throw RangeError("The area requested must be less than 100km2");
    }

    const elevatedSurfaces = polygon([
      [
        [-73.904443327547412, -51.888469736942632],
        [-70.88203831519283, -20.86255705909867],
        [-62.863412772211284, -21.417692673612777],
        [-64.343774410915572, -28.696137397242179],
        [-62.678367567373243, -28.881182602080212],
        [-66.502635134025979, -52.690332291240786],
        [-73.904443327547412, -51.888469736942632],
      ],
    ]);

    const interseccion = booleanContains(elevatedSurfaces, inputPolygon);

    if (
      interseccion == true &&
      contour.equidistance.value < Contour.MIN_MOUNTAIN_EQUIDISTANCE_ALLOWED
    ) {
      throw RangeError("Equidistance must be grather than 100");
    } else if (
      contour.equidistance.value < Contour.MIN_VALLEY_EQUIDISTANCE_ALLOWED
    ) {
      throw RangeError("Equidistance must be grather than 10");
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
