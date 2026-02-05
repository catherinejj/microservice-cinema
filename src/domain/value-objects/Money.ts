export class Money {
  private readonly _cents: number;
  private readonly _currency: string;

  private constructor(cents: number, currency: string) {
    if (!Number.isInteger(cents)) {
      throw new Error("Money: amount must be an integer number of cents");
    }
    if (cents < 0) {
      throw new Error("Money: amount cannot be negative");
    }
    if (!currency || currency.trim().length === 0) {
      throw new Error("Money: currency is required");
    }

    this._cents = cents;
    this._currency = currency.toUpperCase();
  }

  // ---------- Factories ----------
  static fromCents(cents: number, currency = "EUR"): Money {
    return new Money(cents, currency);
  }

  static fromDecimal(amount: number, currency = "EUR"): Money {
    const cents = Math.round(amount * 100);
    return new Money(cents, currency);
  }

  static eur(amount: number): Money {
    return Money.fromDecimal(amount, "EUR");
  }

  // ---------- Getters ----------
  get cents(): number {
    return this._cents;
  }

  get currency(): string {
    return this._currency;
  }

  get amount(): number {
    return this._cents / 100;
  }

  // ---------- Domain logic ----------
  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._cents + other._cents, this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this._cents - other._cents;
    if (result < 0) {
      throw new Error("Money: result cannot be negative");
    }
    return new Money(result, this._currency);
  }

  equals(other: Money): boolean {
    return (
      this._cents === other._cents &&
      this._currency === other._currency
    );
  }

  // ---------- Helpers ----------
  private assertSameCurrency(other: Money) {
    if (this._currency !== other._currency) {
      throw new Error(
        `Money: currency mismatch (${this._currency} vs ${other._currency})`
      );
    }
  }

  toString(): string {
    return `${this.amount.toFixed(2)} ${this._currency}`;
  }
}