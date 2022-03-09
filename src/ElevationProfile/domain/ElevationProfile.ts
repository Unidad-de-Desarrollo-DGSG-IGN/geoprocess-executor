import Line from "../../Shared/domain/Line";
import MultiPoint from "../../Shared/domain/MultiPoint";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";

export default class ElevationProfile {
  private _line: Line;
  private _linePoints: MultiPoint;
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

  constructor(line: Line, linePoints: MultiPoint, wpsEndpoint: wpsEndpoint) {
    this._line = line;
    this._linePoints = linePoints;
    this._wpsEndpoint = wpsEndpoint;
  }

  public get line(): Line {
    return this._line;
  }

  public get linePoints(): MultiPoint {
    return this._linePoints;
  }

  public get wpsEndpoint(): wpsEndpoint {
    return this._wpsEndpoint;
  }

  public get fullWpsEndpoint(): string {
    return `${this.wpsEndpoint.value}&request=Execute&identifier=gs:IntersectionFeatureCollection`;
  }

  public get xmlInput(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>


    <!-- IntersectionFeatureCollection -->
    <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
      <ows:Identifier>gs:IntersectionFeatureCollection</ows:Identifier>
      <wps:DataInputs>
        <wps:Input>
          <ows:Identifier>first feature collection</ows:Identifier>
          <wps:Data>
            <wps:ComplexData mimeType="application/json"><![CDATA[{
              "features": [
              { "type": "Feature", "properties": { }, "geometry": { "type": "multipoint", "coordinates": [${this._linePoints.toJSONFeatureCollection()}] } }
              ]
              }]]></wps:ComplexData>
          </wps:Data>
        </wps:Input>
        <wps:Input>
          <ows:Identifier>second feature collection</ows:Identifier>
          <wps:Reference mimeType="application/json" xlink:href="http://geoserver/wps" method="POST">
            <wps:Body>
    
    
              <!-- PolygonExtraction -->
              <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
                <ows:Identifier>ras:PolygonExtraction</ows:Identifier>
                <wps:DataInputs>
                  <wps:Input>
                    <ows:Identifier>data</ows:Identifier>
                    <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wps" method="POST">
                      <wps:Body>
                          
    
    
                        <!-- CropCoverage -->
                        <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
                          <ows:Identifier>ras:CropCoverage</ows:Identifier>
                          <wps:DataInputs>
                            <wps:Input>
                              <ows:Identifier>coverage</ows:Identifier>
                              <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">
                                <wps:Body>
                                  <wcs:GetCoverage service="WCS" version="1.1.1">
                                    <ows:Identifier>geoprocess:alos_unificado</ows:Identifier>
                                    <wcs:DomainSubset>
                                      <ows:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#4326">
                                        <ows:LowerCorner>-74.000000946 -55.666705466</ows:LowerCorner>
                                        <ows:UpperCorner>-53.499547847 -21.666460109</ows:UpperCorner>
                                      </ows:BoundingBox>
                                    </wcs:DomainSubset>
                                    <wcs:Output format="image/tiff"/>
                                  </wcs:GetCoverage>
                                </wps:Body>
                              </wps:Reference>
                            </wps:Input>
                            <wps:Input>
                              <ows:Identifier>cropShape</ows:Identifier>
                              <wps:Reference mimeType="application/json" xlink:href="http://geoserver/wps" method="POST">
                                <wps:Body>
    
    
                                    <!-- Buffer -->
                                    <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
                                      <ows:Identifier>geo:buffer</ows:Identifier>
                                      <wps:DataInputs>
                                        <wps:Input>
                                          <ows:Identifier>geom</ows:Identifier>
                                          <wps:Data>
                                            <wps:ComplexData mimeType="application/json"><![CDATA[{
                                    "geometry": { "type": "MultiPoint", "coordinates": [${this._linePoints.toString()}]
                                    } }]]></wps:ComplexData>
                                          </wps:Data>
                                        </wps:Input>
                                        <wps:Input>
                                          <ows:Identifier>distance</ows:Identifier>
                                          <wps:Data>
                                            <wps:LiteralData>0.002</wps:LiteralData>
                                          </wps:Data>
                                        </wps:Input>
                                        <wps:Input>
                                          <ows:Identifier>capStyle</ows:Identifier>
                                          <wps:Data>
                                            <wps:LiteralData>Square</wps:LiteralData>
                                          </wps:Data>
                                        </wps:Input>
                                      </wps:DataInputs>
                                      <wps:ResponseForm>
                                        <wps:RawDataOutput mimeType="application/json">
                                          <ows:Identifier>result</ows:Identifier>
                                        </wps:RawDataOutput>
                                      </wps:ResponseForm>
                                    </wps:Execute>
                                    <!-- Buffer -->
    
                                </wps:Body>
                              </wps:Reference>
                            </wps:Input>
                          </wps:DataInputs>
                          <wps:ResponseForm>
                            <wps:RawDataOutput mimeType="image/tiff">
                              <ows:Identifier>result</ows:Identifier>
                            </wps:RawDataOutput>
                          </wps:ResponseForm>
                        </wps:Execute>
                        <!-- /CropCoverage -->
    
    
                      </wps:Body>
                    </wps:Reference>
                  </wps:Input>
                  <wps:Input>
                    <ows:Identifier>roi</ows:Identifier>
                    <wps:Reference mimeType="application/json" xlink:href="http://geoserver/wps" method="POST">
                      <wps:Body>
    
    
                          <!-- Buffer -->
                          <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
                            <ows:Identifier>geo:buffer</ows:Identifier>
                            <wps:DataInputs>
                              <wps:Input>
                                <ows:Identifier>geom</ows:Identifier>
                                <wps:Data>
                                  <wps:ComplexData mimeType="application/json"><![CDATA[{
                          "geometry": { "type": "MultiPoint", "coordinates": [${this._linePoints.toString()}]
                          } }]]></wps:ComplexData>
                                </wps:Data>
                              </wps:Input>
                              <wps:Input>
                                <ows:Identifier>distance</ows:Identifier>
                                <wps:Data>
                                  <wps:LiteralData>0.001</wps:LiteralData>
                                </wps:Data>
                              </wps:Input>
                              <wps:Input>
                                <ows:Identifier>capStyle</ows:Identifier>
                                <wps:Data>
                                  <wps:LiteralData>Square</wps:LiteralData>
                                </wps:Data>
                              </wps:Input>
                            </wps:DataInputs>
                            <wps:ResponseForm>
                              <wps:RawDataOutput mimeType="application/json">
                                <ows:Identifier>result</ows:Identifier>
                              </wps:RawDataOutput>
                            </wps:ResponseForm>
                          </wps:Execute>
                          <!-- Buffer -->
    
    
    
                      </wps:Body>
                    </wps:Reference>
                  </wps:Input>
                  <wps:Input>
                    <ows:Identifier>band</ows:Identifier>
                    <wps:Data>
                      <wps:LiteralData>0</wps:LiteralData>
                    </wps:Data>
                  </wps:Input>
                </wps:DataInputs>
                <wps:ResponseForm>
                  <wps:RawDataOutput mimeType="application/json">
                    <ows:Identifier>result</ows:Identifier>
                  </wps:RawDataOutput>
                </wps:ResponseForm>
              </wps:Execute>
              <!-- /PolygonExtraction -->
    
    
            </wps:Body>
          </wps:Reference>
        </wps:Input>
      </wps:DataInputs>
      <wps:ResponseForm>
        <wps:RawDataOutput mimeType="application/json">
          <ows:Identifier>result</ows:Identifier>
        </wps:RawDataOutput>
      </wps:ResponseForm>
    </wps:Execute>
    <!-- /IntersectionFeatureCollection -->`;
  }
}
