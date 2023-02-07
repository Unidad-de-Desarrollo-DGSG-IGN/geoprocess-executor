import { inject, injectable } from "tsyringe";

import Postman from "../../Shared/domain/Postman";
import RiverCourse from "../domain/RiverCourse";

@injectable()
export default class RiverCourseService {
  private postman: Postman;
  constructor(
    @inject("Postman") postman: Postman
  ) {
    this.postman = postman;
  }

  getFields(): JSON {
    return RiverCourse.FIELDS;
  }

  async execute(riverCourse: RiverCourse): Promise<JSON> {
    return await this.postman.post(riverCourse.fullWpsEndpoint, riverCourse.xmlInput);
  }
}
