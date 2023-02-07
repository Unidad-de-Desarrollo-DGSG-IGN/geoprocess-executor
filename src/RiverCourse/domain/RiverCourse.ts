import LayerFullname from "../../Shared/domain/LayerFullname";
import Point from "../../Shared/domain/Point";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";

export default class RiverCourse {
  private _point: Point;
  private _analysisDirection: string;
  private _wpsEndpoint: wpsEndpoint;
  private _riverLayerFullname: LayerFullname;

  static readonly INTERSECTION_TOLERANCE = 0.001;
  static readonly FIELDS = JSON.parse(
    `[
      {
        "name": "Punto",
        "element": "select",
        "references": "drawedLayers",
        "allowedTypes": ["point"]
      }
    ]`
  );

  constructor(
    point: Point,
    analysisDirection: string,
    wpsEndpoint: wpsEndpoint,
    riverLayerFullname: LayerFullname
  ) {
    this._point = point;
    this._analysisDirection = analysisDirection;
    this._wpsEndpoint = wpsEndpoint;
    this._riverLayerFullname = riverLayerFullname;
  }

  public get point(): Point {
    return this._point;
  }

  public get wpsEndpoint(): wpsEndpoint {
    return this._wpsEndpoint;
  }

  public get fullWpsEndpoint(): string {
    return `${this.wpsEndpoint.value}&request=Execute&identifier=gs:NetworkCourse`;
  }

  public get xmlInput(): string {
    return `<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>gs:NetworkCourse</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier>geom</ows:Identifier>
        <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">
          <wps:Body>
            <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:test="test">
              <wfs:Query typeName="${this._riverLayerFullname.value}"/>
            </wfs:GetFeature>
          </wps:Body>
        </wps:Reference>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>intersectionGeometry</ows:Identifier>
        <wps:Data>
          <wps:ComplexData mimeType="application/wkt"><![CDATA[POINT (${this._point.toProcessString()})]]></wps:ComplexData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>tolerance</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${
            RiverCourse.INTERSECTION_TOLERANCE
          }</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>directionResult</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${this._analysisDirection}</wps:LiteralData>
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
