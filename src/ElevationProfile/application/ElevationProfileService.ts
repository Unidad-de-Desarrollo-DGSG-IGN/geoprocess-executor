import { inject, injectable } from "tsyringe";

import Postman from "../../Shared/domain/Postman";
import ElevationProfile from "../domain/ElevationProfile";
import ElevationProfileToleranceChecker from "../domain/ElevationProfileToleranceChecker";

@injectable()
export default class ElevationProfileService {
  private postman: Postman;
  private tolaranceChecker: ElevationProfileToleranceChecker;
  constructor(
    @inject("Postman") postman: Postman,
    @inject("ElevationProfileToleranceChecker")
    toleranceChecker: ElevationProfileToleranceChecker
  ) {
    this.postman = postman;
    this.tolaranceChecker = toleranceChecker;
  }

  getFields(): JSON {
    return ElevationProfile.FIELDS;
  }

  async execute(elevationProfile: ElevationProfile): Promise<JSON> {
    this.ensureInputDataIsInTolerance(elevationProfile);

    return await this.postman.post(
      elevationProfile.wpsEndpoint.value,
      elevationProfile.jsonInput
    );
  }

  ensureInputDataIsInTolerance(elevationProfile: ElevationProfile): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(elevationProfile);
  }
}
