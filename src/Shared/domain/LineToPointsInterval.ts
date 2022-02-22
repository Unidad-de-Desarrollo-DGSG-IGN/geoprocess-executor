import Line from "./Line";
import Point from "./Point";

export default interface LineToPointsInterval {
  execute(line: Line): Point[];
}
