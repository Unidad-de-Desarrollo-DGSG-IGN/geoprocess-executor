import LayerFullname from "../../Shared/domain/LayerFullname";
import Level from "../../Shared/domain/Level";
import Polygon from "../../Shared/domain/Polygon";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PNGWaterRiseXMLGenerator from "./PNGWaterRiseXMLGenerator";
import TIFFWaterRiseXMLGenerator from "./TIFFWaterRiseXMLGenerator";
import WaterRiseXMLGenerator from "./WaterRiseXMLGenerator";

export default class WaterRise {
  private _polygon: Polygon;
  private _level: Level;
  private _wpsEndpoint: wpsEndpoint;
  private _mdeLayerFullname: LayerFullname;
  private _outputFormat: string;
  private _xmlGenerator: WaterRiseXMLGenerator;
  private _areaBackgoundColor: string;
  private _areaOpacity: number;

  static readonly MAX_AREA_ALLOWED = 100000000;
  static readonly FIELDS = JSON.parse(
    `[
      {
        "name": "Capa",
        "element": "select",
        "references": "drawedLayers",
        "allowedTypes": ["rectangle"],
        "points": ["ne", "sw"]
      },
      {
        "name": "Cota",
        "element": "input",
        "type": "number",
        "min": 0,
        "max": 10000
      }
    ]`
  );

  constructor(
    polygon: Polygon,
    level: Level,
    wpsEndpoint: wpsEndpoint,
    mdeLayerFullname: LayerFullname,
    outputFormat: string,
    areaBackgroundColor: string,
    areaOpacity: number
  ) {
    this.ensureValidOutputFormat(outputFormat);
    this.areaValidOpacity(areaOpacity);

    this._polygon = polygon;
    this._level = level;
    this._wpsEndpoint = wpsEndpoint;
    this._mdeLayerFullname = mdeLayerFullname;

    this._outputFormat = outputFormat;
    switch (this._outputFormat) {
      case "image/png":
        this._xmlGenerator = new PNGWaterRiseXMLGenerator();
        break;
      default:
        this._xmlGenerator = new TIFFWaterRiseXMLGenerator();
        break;
    }

    this._areaBackgoundColor = areaBackgroundColor;
    this._areaOpacity = areaOpacity;
  }

  private ensureValidOutputFormat(outputFormat: string): void {
    const validFormats: Array<string> = [
      "image/png",
      "image/jpeg",
      "image/tiff",
    ];
    if (!validFormats.includes(outputFormat)) {
      throw RangeError("Invalid output format");
    }
  }

  private areaValidOpacity(areaOpacity: number) {
    if (areaOpacity < 0 || areaOpacity > 1) {
      throw RangeError(
        "Invalid area opacity. This value must be between 0 and 1."
      );
    }
  }

  public get polygon(): Polygon {
    return this._polygon;
  }

  public get level(): Level {
    return this._level;
  }

  public get wpsEndpoint(): wpsEndpoint {
    return this._wpsEndpoint;
  }

  private rectangle(): string {
    return this._polygon.toString();
  }

  public get fullWpsEndpoint(): string {
    return `${this.wpsEndpoint.value}&request=Execute&identifier=ras:RangeLookup`;
  }

  public get xmlInput(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
    ${this._xmlGenerator.generate(
      this._mdeLayerFullname.value,
      this.rectangle(),
      this._level.value,
      this._areaBackgoundColor,
      this._areaOpacity
    )}`;
  }
}
