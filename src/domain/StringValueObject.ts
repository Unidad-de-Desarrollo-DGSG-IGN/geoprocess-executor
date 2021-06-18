export default class StringValueObject {
  protected _value: string;

  public constructor(value: string) {
    this._value = value;
    this.ensureIsValidValue();
  }

  public get value(): string {
    return this._value;
  }

  private ensureIsValidValue(): void {
    if (this._value === "") {
      throw RangeError("The value cannot be empty");
    }
  }
}
