import Line from "../../Shared/domain/Line";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";

export default class ElevationProfile {
  private _line: Line;
  private _wpsEndpoint: wpsEndpoint;

  static readonly MAX_LENGHT_ALLOWED = 100;
  static readonly FIELDS = JSON.parse(
    `[
      {
        "name": "Capa",
        "element": "select",
        "references": "drawedLayers",
        "allowedTypes": ["line"],
        "points": ["ne", "sw"]
      }
    ]`
  );

  constructor(line: Line, wpsEndpoint: wpsEndpoint) {
    this._line = line;
    this._wpsEndpoint = wpsEndpoint;
  }

  public get line(): Line {
    return this._line;
  }

  public get wpsEndpoint(): wpsEndpoint {
    return this._wpsEndpoint;
  }

  public get jsonInput(): string {
    return `{"line": "${this.line.toProcessString()}"}`;
  }
}
