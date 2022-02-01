import Latitude from "./Latitude";
import Longitude from "./Longitude";
import Point from "./Point";

export default class Polygon {
  protected _value: Point[];

  public constructor(points: Point[]) {
    this._value = points;
  }

  public static createFromString(stringPolygon: string): Polygon {
    const points: Point[] = [];
    const arrayPolygon: string[] = stringPolygon
      .trim()
      .replace("\n", "")
      .replace("  ", " ")
      .replace("  ", " ")
      .split(",");
    arrayPolygon.forEach((stringPoint) => {
      const arrayPoint: string[] = stringPoint.trim().split(" ");
      points.push(
        new Point(
          new Longitude(parseFloat(arrayPoint[0])),
          new Latitude(parseFloat(arrayPoint[1]))
        )
      );
    });

    return new Polygon(points);
  }

  public get value(): Point[] {
    return this._value;
  }

  public toString(): string {
    const points: string[] = [];
    this.value.forEach((point) => {
      points.push(point.toString);
    });

    return `[[${points.join("],[")}]]`;
  }

  public coordinates(): any {
    const jsonString = `{
      "type": "FeatureCollection",
      "name": "test",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      "features": [
        { "type": "Feature", "properties": { }, "geometry": { "type": "Polygon", "coordinates": [ ${this.toString()} ] } }
      ]
    }`;
    return JSON.parse(jsonString).features[0].geometry.coordinates;
  }
}
