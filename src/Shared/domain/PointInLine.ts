import Latitude from "./Latitude";
import Longitude from "./Longitude";
import Point from "./Point";

export default class PointInLine extends Point {
  protected _positionInLine: number;

  public constructor(
    longitude: Longitude,
    latitude: Latitude,
    positionInLine: number
  ) {
    super(longitude, latitude);
    this._positionInLine = positionInLine;
  }

  public get positionInLine(): number {
    return this._positionInLine;
  }

  public static create(
    stringPoint: string,
    positionInLine: number
  ): PointInLine {
    const arrayPoint: string[] = stringPoint.split(" ");
    return new PointInLine(
      new Longitude(parseFloat(arrayPoint[0])),
      new Latitude(parseFloat(arrayPoint[1])),
      positionInLine
    );
  }
}
