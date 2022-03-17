import Line from "./Line";
import MultiPointInLine from "./MultiPointInLine";

export default interface LineToPointsInterval {
  execute(line: Line): MultiPointInLine;
}
