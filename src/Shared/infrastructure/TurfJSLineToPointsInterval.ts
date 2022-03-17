import along from "@turf/along";
import { feature } from "@turf/helpers";
import length from "@turf/length";
import { injectable } from "tsyringe";

import Line from "../domain/Line";
import LineToPointsInterval from "../domain/LineToPointsInterval";
import MultiPointInLine from "../domain/MultiPointInLine";
import PointInLine from "../domain/PointInLine";

@injectable()
export default class TurfJSLineToPointsInterval
  implements LineToPointsInterval
{
  execute(line: Line): MultiPointInLine {
    let geometry = JSON.parse(`
      {
        "type": "LineString",
        "coordinates": [${line.toString()}]
      }`);
    let lineFeature = feature(geometry);

    const lineLenght: number = length(lineFeature, { units: "meters" });
    const distanceBetweenPoints: number = Math.floor(lineLenght / 100);
    let point: any;
    const points: MultiPointInLine = new MultiPointInLine();
    if (distanceBetweenPoints > 0) {
      for (let step = 0; step < lineLenght; step += distanceBetweenPoints) {
        point = along(lineFeature, step, { units: "meters" });
        points.add(
          PointInLine.create(
            `${point.geometry.coordinates[0]} ${point.geometry.coordinates[1]}`,
            step
          )
        );
      }
    }

    // //Get the last point when line end
    // point = along(lineFeature, lineLenght, { units: "meters" });
    // points.add(
    //   PointInLine.create(
    //     `${point.geometry.coordinates[0]} ${point.geometry.coordinates[1]}`,
    //     lineLenght
    //   )
    // );

    for (let pointIndex = 1; pointIndex < line.value.length; pointIndex ++) {
      geometry = JSON.parse(`
      {
        "type": "LineString",
        "coordinates": [${line.subLine(pointIndex)}]
      }`);
      lineFeature = feature(geometry);
      points.add(
        PointInLine.create(
          `${line.value[pointIndex].longitude.value} ${line.value[pointIndex].latitude.value}`,
          length(lineFeature, { units: "meters" })
        )
      );
    }

    return points;
  }
}
