import NumberValueObject from "./NumberValueObject";

export default class Level extends NumberValueObject {
  public constructor(level: number) {
    super(level);
    this.ensureIsValidLevel();
  }

  private ensureIsValidLevel(): void {
    if (this.value < 0 || this.value > 10000) {
      throw RangeError("The equidistance must be between 0 and 10000");
    }
  }
}
