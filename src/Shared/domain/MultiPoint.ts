import Point from "./Point";

export default class MultiPoint {
  protected _points: Point[] = [];

  public add(point: Point): void {
    this._points.push(point);
  }

  public toString(): string {
    const pointsString: string[] = [];
    this._points.forEach((point) => {
      pointsString.push(point.toString);
    });
    return `[${pointsString.join("],[")}]`;
  }

  public toJSONFeatureCollection(): string {
    const pointsString: string[] = [];
    this._points.forEach((point) => {
      pointsString.push(
        `{ "type": "Feature", "properties": { }, "geometry": { "type": "MultiPoint", "coordinates": [ [ ${point.toString}  ] ] } }`
      );
    });
    return `{
      "type": "FeatureCollection",
      "name": "multipoint",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      "features": [
        ${pointsString.join(",")}
      ]
    }`;
  }
}
