import Height from "./Height";
import Latitude from "./Latitude";
import Longitude from "./Longitude";

export default class Point3D {
  protected _longitude: Longitude;
  protected _latitude: Latitude;
  protected _height: Height;

  public constructor(longitude: Longitude, latitude: Latitude, height: Height) {
    this._longitude = longitude;
    this._latitude = latitude;
    this._height = height;
  }

  public get value(): (Longitude | Latitude | Height)[] {
    return [this._longitude, this._latitude, this._height];
  }

  public get longitude(): Longitude {
    return this._longitude;
  }

  public get latitude(): Latitude {
    return this._latitude;
  }

  public get height(): Height {
    return this._height;
  }

  public get toString(): string {
    return `${this._longitude.value},${this._latitude.value},${this._height.value}`;
  }

  public get toString2D(): string {
    return `${this._longitude.value},${this._latitude.value}`;
  }

  public toProcessString(): string {
    return `${this._longitude.value} ${this._latitude.value} ${this._height.value}`;
  }

  public static createFromString(stringPoint: string): Point3D {
    const arrayPoint: string[] = stringPoint.split(" ");
    return new Point3D(
      new Longitude(parseFloat(arrayPoint[0])),
      new Latitude(parseFloat(arrayPoint[1])),
      new Height(parseFloat(arrayPoint[2]))
    );
  }
}
