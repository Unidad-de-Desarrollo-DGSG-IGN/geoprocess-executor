import along from "@turf/along";
import { feature } from "@turf/helpers";
import length from "@turf/length";
import { injectable } from "tsyringe";

import Point from "../../Shared/domain/Point";
import Line from "../domain/Line";
import LineToPointsInterval from "../domain/LineToPointsInterval";
import MultiPoint from "../domain/MultiPoint";

@injectable()
export default class TurfJSLineToPointsInterval
  implements LineToPointsInterval
{
  execute(line: Line): MultiPoint {
    const geometry = JSON.parse(`
      {
        "type": "LineString",
        "coordinates": [${line.toString()}]
      }`);
    const lineFeature = feature(geometry);

    const lineLenght: number = length(lineFeature, { units: "meters" });
    const distanceBetweenPoints: number = Math.floor(lineLenght / 4);
    let point: any;
    const points: MultiPoint = new MultiPoint();
    if (distanceBetweenPoints > 0) {
      for (let step = 0; step < lineLenght; step += distanceBetweenPoints) {
        point = along(lineFeature, step, { units: "meters" });
        points.add(
          Point.createFromString(
            `${point.geometry.coordinates[0]} ${point.geometry.coordinates[1]}`
          )
        );
      }
    }

    //Get the last point when line end
    point = along(lineFeature, lineLenght, { units: "meters" });
    points.add(
      Point.createFromString(
        `${point.geometry.coordinates[0]} ${point.geometry.coordinates[1]}`
      )
    );

    return points;
  }
}
