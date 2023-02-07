import "reflect-metadata";

import { container } from "tsyringe";

import LayerFullname from "../../Shared/domain/LayerFullname";
import Point from "../../Shared/domain/Point";
import wpsEndpoint from "../../Shared/domain/WPSEndpoint";
import PostmanHTTP from "../../Shared/infrastructure/PostmanHTTP";
import RiverCourse from "../domain/RiverCourse";
import { RiverCourseDirection } from "./RiverCourseDirection";
import RiverCourseService from "./RiverCourseService";

container.register("Postman", {
  useClass: PostmanHTTP,
});

export default class RiverCourseHandler {
  private host: string;
  private riverLayerFullname: string;
  private service: RiverCourseService;
  constructor(
    host: string,
    riverLayerFullname: string,
    service?: RiverCourseService
  ) {
    this.host = host;
    this.riverLayerFullname = riverLayerFullname;
    if (service) {
      this.service = service;
    } else {
      this.service = container.resolve(RiverCourseService);
    }
  }

  getFields(): JSON {
    return this.service.getFields();
  }

  async execute(
    point: string,
    riverCourseDirection = RiverCourseDirection.nascentToMouth
  ): Promise<JSON> {
    const riverCourse: RiverCourse = new RiverCourse(
      Point.createFromString(point),
      riverCourseDirection.toString(),
      new wpsEndpoint(this.host),
      new LayerFullname(this.riverLayerFullname)
    );

    return this.service.execute(riverCourse);
  }
}
