import PointInLine from "./PointInLine";

export default class MultiPointInLine {
  protected _points: PointInLine[] = [];

  public add(point: PointInLine): void {
    this._points.push(point);
    this.reorderPointsByPositionInLine();
  }

  private reorderPointsByPositionInLine(): void {
    this._points.sort((firstPoint, secondPoint) => {
        if (firstPoint.positionInLine < secondPoint.positionInLine) {
            return -1;
        }
        if (firstPoint.positionInLine > secondPoint.positionInLine) {
            return 1;
        }
        return 0;
    });
  }

  public get points(): PointInLine[] {
    return this._points;
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
    let index: number = 0;
    this._points.forEach((point) => {
      pointsString.push(
        `{ "type": "Feature", "properties": { "index": ${index} }, "geometry": { "type": "MultiPoint", "coordinates": [ [ ${point.toString}  ] ] } }`
      );
      index++;
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
