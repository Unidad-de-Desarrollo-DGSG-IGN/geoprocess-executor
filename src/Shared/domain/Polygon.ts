import Point from "./Point";

export default class Polygon {
  protected _value: string;
  protected _points: Point[] | null;

  public constructor(value: string) {
    this._value = value;
    this._points = null;
    this.calculatePoints();
  }

  public calculatePoints() {
    const json = JSON.parse(this._value);
    json.features[0].geometry.coordinates.forEach((point: any) => {
      console.log(point);
    });
  }
}
