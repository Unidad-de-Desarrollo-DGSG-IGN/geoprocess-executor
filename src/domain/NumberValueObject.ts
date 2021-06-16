export default class NumberValueObject {
  protected _value: number;

  public constructor(value: number) {
    this._value = value;
    this.ensureIsValidValue();
  }

  public get value(): number {
    return this._value;
  }

  private ensureIsValidValue(): void {
    if (isNaN(this._value)) {
      throw RangeError("The value must be a number");
    }
  }
}
