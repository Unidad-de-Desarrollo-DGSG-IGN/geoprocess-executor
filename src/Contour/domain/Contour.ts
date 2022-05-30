import Equidistance from "../../Shared/domain/Equidistance";
import Latitude from "../../Shared/domain/Latitude";
import LayerFullname from "../../Shared/domain/LayerFullname";
import Longitude from "../../Shared/domain/Longitude";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";

export default class Contour {
  private _longitudeLower: Longitude;
  private _latitudeLower: Latitude;
  private _longitudeUpper: Longitude;
  private _latitudeUpper: Latitude;
  private _equidistance: Equidistance;
  private _wpsEndpoint: wpsEndpoint;
  private _mdeLayerFullname: LayerFullname;

  static readonly MAX_AREA_ALLOWED = 100000000;
  static readonly MIN_VALLEY_EQUIDISTANCE_ALLOWED = 10;
  static readonly MIN_MOUNTAIN_EQUIDISTANCE_ALLOWED = 10;
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
        "name": "Equidistancia",
        "element": "input",
        "type": "number",
        "min": 10,
        "max": 10000
      }
    ]`
  );

  constructor(
    longitudeLower: Longitude,
    latitudeLower: Latitude,
    longitudeUpper: Longitude,
    latitudeUpper: Latitude,
    equidistance: Equidistance,
    wpsEndpoint: wpsEndpoint,
    mdeLayerFullname: LayerFullname
  ) {
    this._longitudeLower = longitudeLower;
    this._latitudeLower = latitudeLower;
    this._longitudeUpper = longitudeUpper;
    this._latitudeUpper = latitudeUpper;
    this._equidistance = equidistance;
    this._wpsEndpoint = wpsEndpoint;
    this._mdeLayerFullname = mdeLayerFullname;
  }

  public get longitudeLower(): Longitude {
    return this._longitudeLower;
  }

  public get latitudeLower(): Latitude {
    return this._latitudeLower;
  }

  public get longitudeUpper(): Longitude {
    return this._longitudeUpper;
  }

  public get latitudeUpper(): Latitude {
    return this._latitudeUpper;
  }

  public get equidistance(): Equidistance {
    return this._equidistance;
  }

  public get wpsEndpoint(): wpsEndpoint {
    return this._wpsEndpoint;
  }

  public get fullWpsEndpoint(): string {
    return `${this.wpsEndpoint.value}&request=Execute&identifier=gs:Contour`;
  }

  public get xmlInput(): string {
    return `<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>gs:Contour</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier>data</ows:Identifier>
        <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">
          <wps:Body>
            <wcs:GetCoverage service="WCS" version="1.1.1">
              <ows:Identifier>${this._mdeLayerFullname.value}</ows:Identifier>
              <wcs:DomainSubset>
                <ows:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#4326">
                  <ows:LowerCorner>${this._longitudeLower.value} ${this._latitudeLower.value}</ows:LowerCorner>
                  <ows:UpperCorner>${this._longitudeUpper.value} ${this._latitudeUpper.value}</ows:UpperCorner>
                </ows:BoundingBox>
              </wcs:DomainSubset>
              <wcs:Output format="image/tiff"/>
            </wcs:GetCoverage>
          </wps:Body>
        </wps:Reference>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>band</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>0</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>simplify</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>true</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>smooth</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>false</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>interval</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${this._equidistance.value}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier>result</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>`;
  }
}
