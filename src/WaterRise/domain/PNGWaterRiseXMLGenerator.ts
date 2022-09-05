import WaterRiseXMLGenerator from "./WaterRiseXMLGenerator";

export default class PNGWaterRiseXMLGenerator implements WaterRiseXMLGenerator {
  private _outputFormat = "image/png";

  generate(
    mdeLayerFullname: string,
    rectangle: string,
    level: number,
    areaBackgroundColor: string
  ): string {
    return `<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>ras:StyleCoverage</ows:Identifier>
    <wps:DataInputs>
        <wps:Input>
            <ows:Identifier>coverage</ows:Identifier>
            <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wps" method="POST">
                <wps:Body>
                    <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
                        <ows:Identifier>ras:RangeLookup</ows:Identifier>
                        <wps:DataInputs>
                        <wps:Input>
                            <ows:Identifier>coverage</ows:Identifier>
                            <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wps" method="POST">
                            <wps:Body>
                                
                                <wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
                                    <ows:Identifier>ras:CropCoverage</ows:Identifier>
                                    <wps:DataInputs>
                                    <wps:Input>
                                        <ows:Identifier>coverage</ows:Identifier>
                                        <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">
                                        <wps:Body>
                                            <wcs:GetCoverage service="WCS" version="1.1.1">
                                            <ows:Identifier>${mdeLayerFullname}</ows:Identifier>
                                            <wcs:DomainSubset>
                                                <ows:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#4326">
                                                <ows:LowerCorner>-74.000000946 -59.483427301014075</ows:LowerCorner>
                                                <ows:UpperCorner>-26.233442340289727 -21.666460109</ows:UpperCorner>
                                                </ows:BoundingBox>
                                            </wcs:DomainSubset>
                                            <wcs:Output format="image/tiff"/>
                                            </wcs:GetCoverage>
                                        </wps:Body>
                                        </wps:Reference>
                                    </wps:Input>
                                    <wps:Input>
                                        <ows:Identifier>cropShape</ows:Identifier>
                                        <wps:Data>
                                        <wps:ComplexData mimeType="application/json">
                                            <![CDATA[{
                                            "geometry": {
                                            "type": "Polygon",
                                            "coordinates": [ ${rectangle} ] }
                                            }]]></wps:ComplexData>
                                        </wps:Data>
                                    </wps:Input>
                                    </wps:DataInputs>
                                    <wps:ResponseForm>
                                    <wps:RawDataOutput mimeType="image/tiff">
                                        <ows:Identifier>result</ows:Identifier>
                                    </wps:RawDataOutput>
                                    </wps:ResponseForm>
                                </wps:Execute>

                            </wps:Body>
                            </wps:Reference>
                        </wps:Input>
                        <wps:Input>
                            <ows:Identifier>ranges</ows:Identifier>
                            <wps:Data>
                            <wps:LiteralData>[-9999;${level}]</wps:LiteralData>
                            </wps:Data>
                        </wps:Input><wps:Input>
                        <ows:Identifier>outputPixelValues</ows:Identifier>
                        <wps:Data>
                            <wps:LiteralData>127</wps:LiteralData>
                        </wps:Data>
                        </wps:Input>
                        <wps:Input>
                        <ows:Identifier>noData</ows:Identifier>
                        <wps:Data>
                            <wps:LiteralData>0</wps:LiteralData>
                        </wps:Data>
                        </wps:Input>
                        </wps:DataInputs>
                        <wps:ResponseForm>
                        <wps:RawDataOutput mimeType="image/tiff">
                            <ows:Identifier>reclassified</ows:Identifier>
                        </wps:RawDataOutput>
                        </wps:ResponseForm>
                    </wps:Execute>
                
                </wps:Body>
            </wps:Reference>
        </wps:Input>
        <wps:Input>
            <ows:Identifier>style</ows:Identifier>
            <wps:Data>
                <wps:ComplexData mimeType="text/xml; subtype=sld/1.0.0"><![CDATA[
                    <StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
                        <NamedLayer>
                            <Name>leafout</Name>
                            <UserStyle>
                                <Name>leafout</Name>
                                <Title>Day leaf index  reached</Title>
                                <FeatureTypeStyle>
                                    <Rule>
                                        <RasterSymbolizer>
                                            <Opacity>1.0</Opacity>
                                            <ColorMap>
                                                <ColorMapEntry color="#00FF00" quantity="0" opacity="0.0" />
                                                <ColorMapEntry color="${areaBackgroundColor}" quantity="127" />
                                            </ColorMap>
                                        </RasterSymbolizer>
                                    </Rule>
                                </FeatureTypeStyle>
                            </UserStyle>
                        </NamedLayer>
                    </StyledLayerDescriptor>
                    ]]>
                </wps:ComplexData>
            </wps:Data>
        </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
        <wps:RawDataOutput mimeType="image/png">
        <ows:Identifier>result</ows:Identifier>
        </wps:RawDataOutput>
    </wps:ResponseForm>
</wps:Execute>`;
  }
}
