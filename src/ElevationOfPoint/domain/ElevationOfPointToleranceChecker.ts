import ElevationOfPoint from "./ElevationOfPoint";

export default interface ElevationOfPointToleranceChecker {
  ensureInputDataIsInTolerance(elevationOfPoint: ElevationOfPoint): void;
}
