export enum Weekday {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN",
}

export interface OpeningHoursProps {
  // Prisma génère l'id (@default(cuid())) => pas obligatoire à la création
  id?: string;

  cinemaId: string;
  day: Weekday;
  openTime: string;  // "HH:MM"
  closeTime: string; // "HH:MM"
  isClosed?: boolean;
}

export class OpeningHours {
  private readonly _id?: string; // optional tant que pas persisté
  private readonly _cinemaId: string;
  private readonly _day: Weekday;

  private _openTime: string;
  private _closeTime: string;
  private _isClosed: boolean;

  private constructor(props: OpeningHoursProps) {
    // IMPORTANT : on ne vérifie PAS props.id ici, car Prisma le crée à l'insert
    if (!props.cinemaId) throw new Error("OpeningHours: cinemaId is required");
    if (!props.day) throw new Error("OpeningHours: day is required");

    this.assertHHMM(props.openTime, "openTime");
    this.assertHHMM(props.closeTime, "closeTime");

    this._id = props.id;
    this._cinemaId = props.cinemaId;
    this._day = props.day;

    this._openTime = props.openTime;
    this._closeTime = props.closeTime;
    this._isClosed = props.isClosed ?? false;

    // si pas fermé: open/close doivent être cohérents (en minutes)
    if (!this._isClosed) {
      this.assertTimeRangeIsValid(this._openTime, this._closeTime);
    }
  }

  // ---------- Factory ----------
  static create(props: OpeningHoursProps): OpeningHours {
    return new OpeningHours(props);
  }

  // ---------- Getters ----------
  get id(): string | undefined {
    return this._id;
  }

  get cinemaId(): string {
    return this._cinemaId;
  }

  get day(): Weekday {
    return this._day;
  }

  get openTime(): string {
    return this._openTime;
  }

  get closeTime(): string {
    return this._closeTime;
  }

  get isClosed(): boolean {
    return this._isClosed;
  }

  // ---------- Domain behavior ----------
  closeForTheDay(): void {
    this._isClosed = true;
  }

  openForTheDay(openTime: string, closeTime: string): void {
    this.assertHHMM(openTime, "openTime");
    this.assertHHMM(closeTime, "closeTime");
    this.assertTimeRangeIsValid(openTime, closeTime);

    this._isClosed = false;
    this._openTime = openTime;
    this._closeTime = closeTime;
  }

  /**
   * JS Date.getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
   */
  matchesDay(jsDay: number): boolean {
    const map: Record<number, Weekday> = {
      0: Weekday.SUN,
      1: Weekday.MON,
      2: Weekday.TUE,
      3: Weekday.WED,
      4: Weekday.THU,
      5: Weekday.FRI,
      6: Weekday.SAT,
    };
    return map[jsDay] === this._day;
  }

  isOpenAt(date: Date): boolean {
    if (this._isClosed) return false;
    if (!this.matchesDay(date.getDay())) return false;

    const currentMinutes = date.getHours() * 60 + date.getMinutes();

    const openMinutes = OpeningHours.toMinutes(this._openTime);
    const closeMinutes = OpeningHours.toMinutes(this._closeTime);

    // Cas spécial: fermeture après minuit (ex "10:00" -> "00:30")
    if (closeMinutes < openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  // ---------- Helpers ----------
  private assertHHMM(value: string, field: string) {
    if (!/^\d{2}:\d{2}$/.test(value)) {
      throw new Error(`OpeningHours: ${field} must be in HH:MM format`);
    }
    const [h, m] = value.split(":").map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      throw new Error(`OpeningHours: ${field} must be a valid time (00:00 - 23:59)`);
    }
  }

  private assertTimeRangeIsValid(openTime: string, closeTime: string) {
    const openMinutes = OpeningHours.toMinutes(openTime);
    const closeMinutes = OpeningHours.toMinutes(closeTime);
    if (openMinutes === closeMinutes) {
      throw new Error("OpeningHours: openTime and closeTime cannot be the same");
    }
  }

  private static toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }
}