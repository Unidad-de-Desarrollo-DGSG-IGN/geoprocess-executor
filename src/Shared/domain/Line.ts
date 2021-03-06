import Latitude from "./Latitude";
import Longitude from "./Longitude";
import Point from "./Point";

export default class Line {
  protected _value: Point[];

  public constructor(points: Point[]) {
    this._value = points;
  }

  public static createFromString(stringLine: string): Line {
    const points: Point[] = [];
    const arrayLine: string[] = stringLine
      .trim()
      .replace("\n", "")
      .replace("  ", " ")
      .replace("  ", " ")
      .split(",");
    arrayLine.forEach((stringPoint) => {
      const arrayPoint: string[] = stringPoint.trim().split(" ");
      points.push(
        new Point(
          new Longitude(parseFloat(arrayPoint[0])),
          new Latitude(parseFloat(arrayPoint[1]))
        )
      );
    });

    return new Line(points);
  }

  public get value(): Point[] {
    return this._value;
  }

  public toString(): string {
    const points: string[] = [];
    this.value.forEach((point) => {
      points.push(point.toString);
    });

    return `[${points.join("],[")}]`;
  }

  public toProcessString(): string {
    const points: string[] = [];
    this.value.forEach((point) => {
      points.push(point.toProcessString());
    });

    return `${points.join(",")}`;
  }

  public subLine(maxIndex: number): string {
    const points: string[] = [];
    this.value.forEach(function (point, actualIndex) {
      if (actualIndex <= maxIndex) {
        points.push(point.toString);
      }
    });

    return `[${points.join("],[")}]`;
  }
}
