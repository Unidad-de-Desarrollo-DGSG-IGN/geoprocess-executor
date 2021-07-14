import WaterRise from "./WaterRise";

export default interface WaterRiseToleranceChecker {
  ensureInputDataIsInTolerance(waterRise: WaterRise): void;
}
