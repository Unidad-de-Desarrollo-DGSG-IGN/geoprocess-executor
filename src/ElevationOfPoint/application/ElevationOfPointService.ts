import { inject, injectable } from "tsyringe";

import Postman from "../../Shared/domain/Postman";
import ElevationOfPoint from "../domain/ElevationOfPoint";
import ElevationOfPointToleranceChecker from "../domain/ElevationOfPointToleranceChecker";

@injectable()
export default class ElevationOfPointService {
  private postman: Postman;
  private tolaranceChecker: ElevationOfPointToleranceChecker;
  constructor(
    @inject("Postman") postman: Postman,
    @inject("ElevationOfPointToleranceChecker")
    toleranceChecker: ElevationOfPointToleranceChecker
  ) {
    this.postman = postman;
    this.tolaranceChecker = toleranceChecker;
  }

  getFields(): JSON {
    return ElevationOfPoint.FIELDS;
  }

  async execute(elevationOfPoint: ElevationOfPoint): Promise<JSON> {
    this.ensureInputDataIsInTolerance(elevationOfPoint);

    return await this.postman.post(
      elevationOfPoint.wpsEndpoint.value,
      elevationOfPoint.jsonInput
    );
  }

  ensureInputDataIsInTolerance(elevationOfPoint: ElevationOfPoint): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(elevationOfPoint);
  }
}
