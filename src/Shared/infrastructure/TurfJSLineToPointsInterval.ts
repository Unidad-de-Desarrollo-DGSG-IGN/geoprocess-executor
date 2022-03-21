import along from "@turf/along";
import { Feature, feature, Properties } from "@turf/helpers";
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
  private static readonly INTERMEDIATE_POINTS_IN_LINE: number = 100;

  execute(line: Line): MultiPointInLine {
    const geometry = JSON.parse(`
      {
        "type": "LineString",
        "coordinates": [${line.toString()}]
      }`);
    const lineFeature = feature(geometry);

    const lineLenght: number = length(lineFeature, { units: "meters" });
    const distanceBetweenPoints: number =
      this.calculateDistanceBetweenPoints(lineLenght);
    let point: any;
    const points: MultiPointInLine = new MultiPointInLine();
    if (distanceBetweenPoints > 0) {
      this.getIntermediatePoints(
        lineFeature,
        lineLenght,
        distanceBetweenPoints
      ).forEach((pointInLine) => {
        points.add(pointInLine);
      });
    } else {
      points.add(this.getFirstNode(line));
    }

    this.getAllNodesExceptFirst(line).forEach((pointInLine) => {
      points.add(pointInLine);
    });

    return points;
  }

  private calculateDistanceBetweenPoints(lineLenght: number): number {
    return Math.floor(
      lineLenght / TurfJSLineToPointsInterval.INTERMEDIATE_POINTS_IN_LINE
    );
  }

  private getIntermediatePoints(
    lineFeature: Feature<any, Properties>,
    lineLenght: number,
    distanceBetweenPoints: number
  ): PointInLine[] {
    let point: any;
    const pointsInLine: PointInLine[] = [];

    for (let step = 0; step < lineLenght; step += distanceBetweenPoints) {
      point = along(lineFeature, step, { units: "meters" });
      pointsInLine.push(
        PointInLine.create(
          `${point.geometry.coordinates[0]} ${point.geometry.coordinates[1]}`,
          step
        )
      );
    }

    return pointsInLine;
  }

  private getFirstNode(line: Line): PointInLine {
    const geometry = JSON.parse(`
    {
      "type": "LineString",
      "coordinates": [${line.subLine(0)}]
    }`);
    const lineFeature = feature(geometry);
    return PointInLine.create(
      `${line.value[0].longitude.value} ${line.value[0].latitude.value}`,
      length(lineFeature, { units: "meters" })
    );
  }

  private getAllNodesExceptFirst(line: Line): PointInLine[] {
    const pointsInLine: PointInLine[] = [];

    for (let pointIndex = 1; pointIndex < line.value.length; pointIndex++) {
      const geometry = JSON.parse(`
      {
        "type": "LineString",
        "coordinates": [${line.subLine(pointIndex)}]
      }`);
      const lineFeature = feature(geometry);
      pointsInLine.push(
        PointInLine.create(
          `${line.value[pointIndex].longitude.value} ${line.value[pointIndex].latitude.value}`,
          length(lineFeature, { units: "meters" })
        )
      );
    }

    return pointsInLine;
  }
}
