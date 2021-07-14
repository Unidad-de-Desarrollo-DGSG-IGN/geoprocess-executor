import Contour from "./Contour";

export default interface ContourToleranceChecker {
  ensureInputDataIsInTolerance(contour: Contour): void;
}
