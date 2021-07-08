import NumberValueObject from "./NumberValueObject";

export default class Latitude extends NumberValueObject {
  public constructor(longitude: number) {
    super(longitude);
    this.ensureIsValidLatitude();
  }

  private ensureIsValidLatitude(): void {
    if (this.value < -84 || this.value > -20) {
      throw RangeError("The latitud must be between -84 and -20");
    }
  }
}
