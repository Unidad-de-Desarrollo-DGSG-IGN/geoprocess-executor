import NumberValueObject from "./NumberValueObject";

export default class Equidistance extends NumberValueObject {
  public constructor(longitude: number) {
    super(longitude);
    this.ensureIsValidEquidistance();
  }

  private ensureIsValidEquidistance(): void {
    if (this.value < 100 || this.value > 10000) {
      throw RangeError("The latitud must be between 100 and 10000");
    }
  }
}
