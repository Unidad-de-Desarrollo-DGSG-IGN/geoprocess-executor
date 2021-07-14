import { inject, injectable } from "tsyringe";

import Postman from "../../Shared/domain/Postman";
import Contour from "../domain/Contour";
import ToleranceChecker from "../domain/ContourToleranceChecker";

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

  async execute(contour: Contour): Promise<JSON> {
    this.ensureInputDataIsInTolerance(contour);

    return await this.postman.post(contour.fullWpsEndpoint, contour.xmlInput);
  }

  ensureInputDataIsInTolerance(contour: Contour): void {
    this.tolaranceChecker.ensureInputDataIsInTolerance(contour);
  }
}
