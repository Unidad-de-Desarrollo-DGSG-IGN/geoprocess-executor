import Latitude from "./Latitude";
import Longitude from "./Longitude";

export default class Point {
  protected _longitude: Longitude;
  protected _latitude: Latitude;

  public constructor(longitude: Longitude, latitude: Latitude) {
    this._longitude = longitude;
    this._latitude = latitude;
  }

  public get value(): (Longitude | Latitude)[] {
    return [this._longitude, this._latitude];
  }

  public get longitude(): Longitude {
    return this._longitude;
  }

  public get latitude(): Latitude {
    return this._latitude;
  }

  public get toString(): string {
    return `${this._longitude.value},${this._latitude.value}`;
  }

  public toProcessString(): string {
    return `${this._longitude.value} ${this._latitude.value}`;
  }

  public static createFromString(stringPoint: string): Point {
    const arrayPoint: string[] = stringPoint.split(" ");
    return new Point(
      new Longitude(parseFloat(arrayPoint[0])),
      new Latitude(parseFloat(arrayPoint[1]))
    );
  }
}
