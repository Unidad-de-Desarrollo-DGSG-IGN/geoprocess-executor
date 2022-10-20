import along from "@turf/along";
import buffer from "@turf/buffer";
import distance from "@turf/distance";
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

    let previousCalculatedPoint = this.getInitialLineNode(lineFeature);

    if (distanceBetweenPoints > 0) {
      for (
        let distance = distanceBetweenPoints;
        distance < lineLenght;
        distance += distanceBetweenPoints
      ) {
        calculatedPoint = this.calculatePointOverLineAtDistance(
          lineFeature,
          distance,
          previousCalculatedPoint
        );
        previousCalculatedPoint = calculatedPoint;
        if (calculatedPoint != null) {
          pointsInLine.add(
            PointInLine.create(
              `${calculatedPoint.geometry.coordinates[0]} ${calculatedPoint.geometry.coordinates[1]}`,
              distance
            )
          );
        }
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

  private calculatePointOverLineAtDistance(
    line: Feature<any, Properties>,
    distance: number,
    previousCalculatedPoint: Feature<any, Properties>
  ): Feature | null {
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
      bufferRadius
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
        bufferRadius
      );
    }

    if (interesctionPoints == null) {
      console.warn(interesctionPoints);
      return null;
    }

    return this.obtainBestIntersectionPoint(
      interesctionPoints,
      previousCalculatedPoint
    );
  }

  private NearPointToLineIntersect(
    nearPoint: Feature,
    line: Feature<any, Properties>,
    bufferRadius: number
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

  private getInitialLineNode(
    line: Feature<any, Properties>
  ): Feature<any, Properties> {
    return getCoords(line)[0];
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

  private obtainBestIntersectionPoint(
    interesctionPoints: FeatureCollection<any, Properties>,
    previousCalculatedPoint: Feature<any, Properties>
  ) {
    if (interesctionPoints.features.length == 1) {
      return interesctionPoints.features[0];
    }
    let minDistanceFeatureIndex = 0;
    let minDistance = -9999;
    interesctionPoints.features.forEach((feature, index) => {
      const calculatedDistance = distance(feature, previousCalculatedPoint);
      if (calculatedDistance < minDistance) {
        minDistance = calculatedDistance;
        minDistanceFeatureIndex = index;
      }
    });
    return interesctionPoints.features[minDistanceFeatureIndex];
  }
}
