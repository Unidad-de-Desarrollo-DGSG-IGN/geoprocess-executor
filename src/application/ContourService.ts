import Equidistance from "../domain/Equidistance";
import Latitude from "../domain/Latitude";
import Longitude from "../domain/Longitude";
import Postman from "../domain/Postman";

export default class ContourService {
  private postman: Postman;
  constructor(postman: Postman) {
    this.postman = postman;
  }

  getForm(): HTMLElement {
    const div = document.createElement("div");
    div.innerHTML = `<label for="latitudeLower">latitudeLower</label>`;
    div.innerHTML += `<input type="text" name="latitudeLower" id="latitudeLower"></input>`;
    div.innerHTML += `<label for="longitudeLower">longitudeLower</label>`;
    div.innerHTML += `<input type="text" name="longitudeLower" id="longitudeLower"></input>`;
    div.innerHTML += `<label for="latitudeUpper">latitudeUpper</label>`;
    div.innerHTML += `<input type="text" name="latitudeUpper" id="latitudeUpper"></input>`;
    div.innerHTML += `<label for="longitudeUpper">longitudeUpper</label>`;
    div.innerHTML += `<input type="text" name="longitudeUpper" id="longitudeUpper"></input>`;
    div.innerHTML += `<label for="equidistance">equidistance</label>`;
    div.innerHTML += `<input type="text" name="equidistance" id="equidistance"></input>`;
    return div;
  }

  async execute(
    longitudeLower: Longitude,
    latitudeLower: Latitude,
    longitudeUpper: Longitude,
    latitudeUpper: Latitude,
    equidistance: Equidistance
  ): Promise<JSON> {
    const inputXml = `<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
  <ows:Identifier>gs:Contour</ows:Identifier>
  <wps:DataInputs>
    <wps:Input>
      <ows:Identifier>data</ows:Identifier>
      <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">
        <wps:Body>
          <wcs:GetCoverage service="WCS" version="1.1.1">
            <ows:Identifier>ign:alos_unificado</ows:Identifier>
            <wcs:DomainSubset>
              <ows:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#4326">
                <ows:LowerCorner>${longitudeLower.value} ${latitudeLower.value}</ows:LowerCorner>
                <ows:UpperCorner>${longitudeUpper.value} ${latitudeUpper.value}</ows:UpperCorner>
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
        <wps:LiteralData>true</wps:LiteralData>
      </wps:Data>
    </wps:Input>
    <wps:Input>
      <ows:Identifier>interval</ows:Identifier>
      <wps:Data>
        <wps:LiteralData>${equidistance.value}</wps:LiteralData>
      </wps:Data>
    </wps:Input>
  </wps:DataInputs>
  <wps:ResponseForm>
    <wps:RawDataOutput mimeType="application/json">
      <ows:Identifier>result</ows:Identifier>
    </wps:RawDataOutput>
  </wps:ResponseForm>
</wps:Execute>`;

    return await this.postman.post(
      "http://172.20.205.70:8080/geoserver/ows?service=WPS&version=1.0.0&request=Execute&identifier=gs:Contour",
      inputXml
    );
  }
}
