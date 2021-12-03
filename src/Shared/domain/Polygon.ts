import Latitude from "./Latitude";
import Longitude from "./Longitude";
import Point from "./Point";

export default class Polygon {
  protected _value: string;
  protected _points: Point[];
  protected _json: any;

  public constructor(value: string) {
    this._value = value;
    this._points = [];
    this._json = JSON.parse("[]");
    this.setPoints();
  }

  private setPoints() {
    this._points = [];
    this._json = JSON.parse(this._value);
    this._json.features[0].geometry.coordinates[0].forEach(
      (point: string[]) => {
        this._points.push(
          new Point(
            new Longitude(parseFloat(point[0])),
            new Latitude(parseFloat(point[1]))
          )
        );
      }
    );
  }

  public toString(): string {
    const points: string[] = [];
    this._points.forEach((point) => {
      points.push(point.toString);
    });

    return `[[${points.join("],[")}]]`;
  }

  public coordinates(): any {
    return this._json.features[0].geometry.coordinates;
  }
}
