import { inject, injectable } from "tsyringe";

import Postman from "../../Shared/domain/Postman";
import WaterRise from "../domain/WaterRise";
import WaterRiseToleranceChecker from "../domain/WaterRiseToleranceChecker";

@injectable()
export default class WaterRiseService {
  private postman: Postman;
  private tolaranceChecker: WaterRiseToleranceChecker;
  constructor(
    @inject("Postman") postman: Postman,
    @inject("WaterRiseToleranceChecker")
    toleranceChecker: WaterRiseToleranceChecker
  ) {
    this.postman = postman;
    this.tolaranceChecker = toleranceChecker;
  }

  getFields(): JSON {
    return WaterRise.FIELDS;
  }

  async execute(waterRise: WaterRise): Promise<JSON> {
    this.ensureInputDataIsInTolerance(waterRise);

    return await this.postman.post(
      waterRise.fullWpsEndpoint,
      waterRise.xmlInput
    );
  }

  ensureInputDataIsInTolerance(waterRise: WaterRise): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(waterRise);
  }
}
