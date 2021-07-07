import Contour from "../domain/Contour";

export default interface ToleranceChecker {
  ensureInputDataIsInTolerance(contour: Contour): void;
}
