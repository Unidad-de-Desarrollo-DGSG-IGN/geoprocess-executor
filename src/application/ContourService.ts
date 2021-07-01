import area from "@turf/area";
import booleanContains from "@turf/boolean-contains";
import { Feature, polygon } from "@turf/helpers";
import { inject, injectable } from "tsyringe";

import Equidistance from "../domain/Equidistance";
import Latitude from "../domain/Latitude";
import Longitude from "../domain/Longitude";
import Postman from "../domain/Postman";
import wpsEndpoint from "../domain/WPSEndpoint";

@injectable()
export default class ContourService {
  private postman: Postman;
  constructor(@inject("Postman") postman: Postman) {
    this.postman = postman;
  }

  getFields(): JSON {
    return JSON.parse(
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
  }

  async execute(
    longitudeLower: Longitude,
    latitudeLower: Latitude,
    longitudeUpper: Longitude,
    latitudeUpper: Latitude,
    equidistance: Equidistance,
    wpsEndpoint: wpsEndpoint
  ): Promise<JSON> {
    this.ensureInputDataIsInTolerance(
      longitudeLower,
      latitudeLower,
      longitudeUpper,
      latitudeUpper,
      equidistance
    );

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
      `${wpsEndpoint.value}&request=Execute&identifier=gs:Contour`,
      inputXml
    );
  }

  pointsToPolygon(
    longitudeLower: Longitude, //x2
    latitudeLower: Latitude, //y2
    longitudeUpper: Longitude, //x1
    latitudeUpper: Latitude //y1
  ): Feature {
    const x = polygon([
      [
        [longitudeUpper.value, latitudeUpper.value], //x1y1
        [longitudeUpper.value, latitudeLower.value], //x1y2
        [longitudeLower.value, latitudeLower.value], //x2y2
        [longitudeLower.value, latitudeUpper.value], //x2y1
        [longitudeUpper.value, latitudeUpper.value], //x1y1
      ],
    ]);

    return x;
  }

  ensureInputDataIsInTolerance(
    longitudeLower: Longitude,
    latitudeLower: Latitude,
    longitudeUpper: Longitude,
    latitudeUpper: Latitude,
    equidistance: Equidistance
  ): void {
    const inputPolygon = this.pointsToPolygon(
      longitudeLower,
      latitudeLower,
      longitudeUpper,
      latitudeUpper
    );

    if (area(inputPolygon) > 100000000) {
      throw RangeError("The area requested must be less than 100km2");
    }

    const elevatedSurfaces = polygon([
      [
        [-73.904443327547412, -51.888469736942632],
        [-70.88203831519283, -20.86255705909867],
        [-62.863412772211284, -21.417692673612777],
        [-64.343774410915572, -28.696137397242179],
        [-62.678367567373243, -28.881182602080212],
        [-66.502635134025979, -52.690332291240786],
        [-73.904443327547412, -51.888469736942632],
      ],
    ]);

    const interseccion = booleanContains(elevatedSurfaces, inputPolygon);

    if (interseccion == true && equidistance.value < 100) {
      throw RangeError("Equidistance must be grather than 100");
    } else if (equidistance.value < 10) {
      throw RangeError("Equidistance must be grather than 10");
    }
  }
}
