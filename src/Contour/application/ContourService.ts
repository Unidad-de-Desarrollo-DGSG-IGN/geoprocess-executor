import { inject, injectable } from "tsyringe";

import Equidistance from "../../Shared/domain/Equidistance";
import Latitude from "../../Shared/domain/Latitude";
import Longitude from "../../Shared/domain/Longitude";
import Postman from "../../Shared/domain/Postman";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import Contour from "../domain/Contour";
import ToleranceChecker from "../domain/ToleranceChecker";

@injectable()
export default class ContourService {
  private postman: Postman;
  private tolaranceChecker: ToleranceChecker;
  constructor(
    @inject("Postman") postman: Postman,
    @inject("ToleranceChecker") toleranceChecker: ToleranceChecker
  ) {
    this.postman = postman;
    this.tolaranceChecker = toleranceChecker;
  }

  getFields(): JSON {
    return Contour.FIELDS;
  }

  async execute(
    longitudeLower: Longitude,
    latitudeLower: Latitude,
    longitudeUpper: Longitude,
    latitudeUpper: Latitude,
    equidistance: Equidistance,
    wpsEndpoint: wpsEndpoint
  ): Promise<JSON> {
    const contour: Contour = new Contour(
      longitudeLower,
      latitudeLower,
      longitudeUpper,
      latitudeUpper,
      equidistance,
      wpsEndpoint
    );

    return await this.postman.post(
      `${wpsEndpoint.value}&request=Execute&identifier=gs:Contour`,
      contour.xmlInput
    );
  }

  ensureInputDataIsInTolerance(contour: Contour): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(contour);
  }
}
