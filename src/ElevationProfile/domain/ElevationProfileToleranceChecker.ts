import ElevationProfile from "./ElevationProfile";

export default interface ElevationProfileToleranceChecker {
  ensureInputDataIsInTolerance(elevationProfile: ElevationProfile): void;
}
