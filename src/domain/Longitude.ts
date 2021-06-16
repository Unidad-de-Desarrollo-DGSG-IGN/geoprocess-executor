import NumberValueObject from "./NumberValueObject";

export default class Longitude extends NumberValueObject {
  public constructor(longitude: number) {
    super(longitude);
    this.ensureIsValidLongitude();
  }

  private ensureIsValidLongitude(): void {
    if (this.value < -74 || this.value > -52) {
      throw RangeError("The latitud must be between -74 and -52");
    }
  }
}
