import Contour from "./Contour";
import ContourV2 from "./ContourV2";

export default interface ContourToleranceChecker {
  ensureInputDataIsInTolerance(contour: Contour): void;
  ensureInputDataIsInToleranceV2(contour: ContourV2): void;
}
