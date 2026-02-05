export class TimeRange {
  private constructor(
    private readonly _start: Date,
    private readonly _end: Date,
  ) {}

  static of(start: Date, end: Date): TimeRange {
    if (!(start instanceof Date) || isNaN(start.getTime())) {
      throw new Error("TimeRange: invalid start");
    }
    if (!(end instanceof Date) || isNaN(end.getTime())) {
      throw new Error("TimeRange: invalid end");
    }
    if (end <= start) {
      throw new Error("TimeRange: end must be after start");
    }
    return new TimeRange(start, end);
  }


  // ---------- Factory ----------
  static create(start: Date, end: Date): TimeRange {
    return new TimeRange(start, end);
  }

  // ---------- Getters ----------
  get start(): Date {
    return new Date(this._start);
  }

  get end(): Date {
    return new Date(this._end);
  }

  // ---------- Domain logic ----------
  get durationMs(): number {
    return this._end.getTime() - this._start.getTime();
  }

  get durationMinutes(): number {
    return Math.floor(this.durationMs / 60000);
  }

  overlaps(other: TimeRange): boolean {
    return this._start < other._end && other._start < this._end;
  }

  contains(date: Date): boolean {
    return date >= this._start && date <= this._end;
  }

  toString(): string {
    return `${this._start.toISOString()} → ${this._end.toISOString()}`;
  }
}