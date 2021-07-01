import NumberValueObject from "./NumberValueObject";

export default class Equidistance extends NumberValueObject {
  public constructor(longitude: number) {
    super(longitude);
    this.ensureIsValidEquidistance();
  }

  private ensureIsValidEquidistance(): void {
    if (this.value < 10 || this.value > 10000) {
      throw RangeError("The equidistance must be between 10 and 10000");
    }
  }
}
