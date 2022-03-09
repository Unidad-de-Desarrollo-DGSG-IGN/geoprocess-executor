import Line from "./Line";
import MultiPoint from "./MultiPoint";

export default interface LineToPointsInterval {
  execute(line: Line): MultiPoint;
}
