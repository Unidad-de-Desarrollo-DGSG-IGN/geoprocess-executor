import Point from "../../Shared/domain/Point";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";

export default class ElevationOfPoint {
  private _point: Point;
  private _wpsEndpoint: wpsEndpoint;

  static readonly MAX_LENGHT_ALLOWED = 100;
  static readonly FIELDS = JSON.parse(
    `[
      {
        "name": "Capa",
        "element": "select",
        "references": "drawedLayers",
        "allowedTypes": ["point"]
      }
    ]`
  );

  constructor(point: Point, wpsEndpoint: wpsEndpoint) {
    this._point = point;
    this._wpsEndpoint = wpsEndpoint;
  }

  public get point(): Point {
    return this._point;
  }

  public get wpsEndpoint(): wpsEndpoint {
    return this._wpsEndpoint;
  }

  public get jsonInput(): string {
    return `{"point": "${this.point.toProcessString()}"}`;
  }
}
