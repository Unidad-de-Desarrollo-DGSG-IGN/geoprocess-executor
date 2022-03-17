import Latitude from "./Latitude";
import Longitude from "./Longitude";
import Point3D from "./Point3D";

export default class Line3D {
  protected _value: Point3D[];

  public constructor(points: Point3D[]) {
    this._value = points;
  }

  public static createFromString(stringLine: string): Line3D {
    const points: Point3D[] = [];
    const arrayLine: string[] = stringLine
      .trim()
      .replace("\n", "")
      .replace("  ", " ")
      .replace("  ", " ")
      .split(",");
    arrayLine.forEach((stringPoint) => {
      const arrayPoint: string[] = stringPoint.trim().split(" ");
      points.push(
        new Point3D(
          new Longitude(parseFloat(arrayPoint[0])),
          new Latitude(parseFloat(arrayPoint[1])),
          new Latitude(parseFloat(arrayPoint[2]))
        )
      );
    });

    return new Line3D(points);
  }

  public get value(): Point3D[] {
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

  public toLineString3D(): string {
    return '{ "type": "LineString", "coordinates": [' + this.toString() + "] }";
  }

  public toFeatureCollection(): string {
    let features: string[] = [];
    for (let index = 1; index < this._value.length; index++) {
      features[(index-1)] = `{
        "type": "Feature",
        "geometry": {
          "type": "MultiLineString",
          "coordinates": [
            [
              [ ${this._value[index-1].toString2D} ], [ ${this._value[index].toString2D} ]
            ]
          ],
          "properties": {
            "index": ${index},
            "height": ${this._value[index-1].height.value}
          },
          "id": "${(index-1)}"
        }
      }`;
    }

    return `{
      "type": "FeatureCollection",
      "features": [ ${features.join(",")} ]
    }`;
  }
}
