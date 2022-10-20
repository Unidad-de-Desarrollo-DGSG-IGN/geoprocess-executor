import NumberValueObject from "./NumberValueObject";

export default class IntegerValueObject extends NumberValueObject {
  public constructor(value: number) {
    super(value);
    this.ensureIsValidInteger();
  }

  private ensureIsValidInteger(): void {
    if (!Number.isInteger(this._value)) {
      throw RangeError("The value must be an integer");
    }
  }
}
