import along from "@turf/along";
import buffer from "@turf/buffer";
import { Feature, feature, FeatureCollection, Properties } from "@turf/helpers";
import { getCoords } from "@turf/invariant";
import length from "@turf/length";
import lineIntersect from "@turf/line-intersect";
import pointToLineDistance from "@turf/point-to-line-distance";
import { injectable } from "tsyringe";

import Line from "../domain/Line";
import LineToPointsInterval from "../domain/LineToPointsInterval";
import MultiPointInLine from "../domain/MultiPointInLine";
import Point from "../domain/Point";
import PointInLine from "../domain/PointInLine";

@injectable()
export default class TurfJSLineToPointsInterval
  implements LineToPointsInterval
{
  private static readonly INTERMEDIATE_POINTS_IN_LINE: number = 100;
  private static readonly BUFFER_RADIOUS_CONSTANT: number = 1.1;
  private static readonly BUFFER_APPROXIMATION_CONSTANT: number = 0.01;

  execute(line: Line): MultiPointInLine {
    return this.discatrizeLine(line);
  }

  private calculateLineLength(line: Feature): number {
    return length(line, { units: "meters" });
  }

  private getLineVertices(line: Feature<any, Properties>): any[] {
    return getCoords(line);
  }

  private calculateDistanceBetweenPoints(lineLenght: number): number {
    return Math.floor(
      lineLenght / TurfJSLineToPointsInterval.INTERMEDIATE_POINTS_IN_LINE
    );
  }

  private discatrizeLine(line: Line): MultiPointInLine {
    let calculatedPoint: any;
    const pointsInLine: MultiPointInLine = new MultiPointInLine();
    const lineFeature = this.convertLineDomainToTurfFeature(line);
    const lineLenght: number = this.calculateLineLength(lineFeature);
    const distanceBetweenPoints: number =
      this.calculateDistanceBetweenPoints(lineLenght);

    if (distanceBetweenPoints > 0) {
      for (
        let distance = distanceBetweenPoints;
        distance < lineLenght;
        distance += distanceBetweenPoints
      ) {
        calculatedPoint = this.calculateNearPointAtDistance(
          lineFeature,
          distance
        );
        pointsInLine.add(
          PointInLine.create(
            `${calculatedPoint.geometry.coordinates[0]} ${calculatedPoint.geometry.coordinates[1]}`,
            distance
          )
        );
      }
    }

    this.getAllLineNodes(line).forEach((pointInLine) => {
      pointsInLine.add(pointInLine);
    });

    return pointsInLine;
  }

  private convertLineDomainToTurfFeature(line: Line): Feature {
    const geometry = JSON.parse(`
      {
        "type": "LineString",
        "coordinates": [${line.toString()}]
      }`);
    return feature(geometry);
  }

  private calculateNearPointAtDistance(
    line: Feature<any, Properties>,
    distance: number
  ): Feature {
    const nearPoint = along(line, distance, { units: "meters" });
    const nearPointToLineDistance = pointToLineDistance(nearPoint, line, {
      units: "meters",
    });
    let bufferRadius =
      nearPointToLineDistance *
      TurfJSLineToPointsInterval.BUFFER_RADIOUS_CONSTANT;
    let interesctionPoints = this.NearPointToLineIntersect(
      nearPoint,
      line,
      bufferRadius,
      distance
    );
    while (
      interesctionPoints == null &&
      bufferRadius < TurfJSLineToPointsInterval.BUFFER_RADIOUS_CONSTANT * 3
    ) {
      bufferRadius =
        bufferRadius * TurfJSLineToPointsInterval.BUFFER_APPROXIMATION_CONSTANT;
      interesctionPoints = this.NearPointToLineIntersect(
        nearPoint,
        line,
        bufferRadius,
        distance
      );
    }

    if (interesctionPoints == null) {
      console.warn(interesctionPoints);
    }

    return interesctionPoints!.features[0];
  }

  private NearPointToLineIntersect(
    nearPoint: Feature,
    line: Feature<any, Properties>,
    bufferRadius: number,
    distance: number
  ): FeatureCollection<any, Properties> | null {
    if (bufferRadius == 0) {
      bufferRadius = 0.0001;
    }
    const nearPointBuffered = buffer(nearPoint, bufferRadius, {
      units: "meters",
    });
    const interesctionPoints = lineIntersect(line, nearPointBuffered);
    if (interesctionPoints.features[0] == undefined) {
      return null;
    }
    return interesctionPoints;
  }

  private getAllLineNodes(line: Line): PointInLine[] {
    const pointsInLine: PointInLine[] = [];

    for (let pointIndex = 0; pointIndex < line.value.length; pointIndex++) {
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
