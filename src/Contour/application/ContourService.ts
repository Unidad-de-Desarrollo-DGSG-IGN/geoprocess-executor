import { inject, injectable } from "tsyringe";

import Postman from "../../Shared/domain/Postman";
import Contour from "../domain/Contour";
import ToleranceChecker from "../domain/ContourToleranceChecker";
import ContourV2 from "../domain/ContourV2";

@injectable()
export default class ContourService {
  private postman: Postman;
  private tolaranceChecker: ToleranceChecker;
  constructor(
    @inject("Postman") postman: Postman,
    @inject("ContourToleranceChecker") toleranceChecker: ToleranceChecker
  ) {
    this.postman = postman;
    this.tolaranceChecker = toleranceChecker;
  }

  getFields(): JSON {
    return Contour.FIELDS;
  }

  async execute(contour: Contour): Promise<JSON> {
    this.ensureInputDataIsInTolerance(contour);

    return await this.postman.post(contour.fullWpsEndpoint, contour.xmlInput);
  }

  async executeV2(contour: ContourV2): Promise<JSON> {
    this.ensureInputDataIsInToleranceV2(contour);

    return await this.postman.post(contour.fullWpsEndpoint, contour.xmlInput);
  }

  ensureInputDataIsInTolerance(contour: Contour): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(contour);
  }

  ensureInputDataIsInToleranceV2(contour: ContourV2): void {
    this.tolaranceChecker.ensureInputDataIsInToleranceV2(contour);
  }
}
