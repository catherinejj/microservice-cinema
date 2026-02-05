import { Screening } from "./Screening";

export interface MovieProps {
  // Prisma génère l'id (@default(cuid())) => pas obligatoire à la création
  id?: string;

  title: string;
  description: string;
  duration: number; // minutes
  coverImage?: string | null;
  category: string;
  releaseDate: Date;
  rating: number;

  screenings?: Screening[];
}

export class Movie {
  private readonly _id?: string; // optional tant que pas persisté

  private _title: string;
  private _description: string;
  private _duration: number;
  private _coverImage?: string | null;
  private _category: string;
  private _releaseDate: Date;
  private _rating: number;

  private _screenings: Screening[];

  private constructor(props: MovieProps) {
    // validations communes
    this.assertNonEmpty(props.title, "title");
    this.assertNonEmpty(props.description, "description");
    this.assertNonEmpty(props.category, "category");
    this.assertValidDate(props.releaseDate, "releaseDate");

    if (!Number.isInteger(props.duration) || props.duration <= 0) {
      throw new Error("Movie: duration must be an integer > 0 (minutes)");
    }

    if (typeof props.rating !== "number" || props.rating < 0 || props.rating > 10) {
      throw new Error("Movie: rating must be between 0 and 10");
    }

    // IMPORTANT : on ne force PAS l'id ici (Prisma le crée à l'insert)
    this._id = props.id;

    this._title = props.title.trim();
    this._description = props.description.trim();
    this._duration = props.duration;
    this._coverImage = props.coverImage ?? null;
    this._category = props.category.trim();
    this._releaseDate = new Date(props.releaseDate);
    this._rating = props.rating;

    this._screenings = props.screenings ?? [];
  }

  // Création (new) : sans id
  static create(props: MovieProps): Movie {
    return new Movie(props);
  }

  // ---------- Getters ----------
  get id(): string | undefined {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get duration(): number {
    return this._duration;
  }

  get coverImage(): string | null | undefined {
    return this._coverImage;
  }

  get category(): string {
    return this._category;
  }

  get releaseDate(): Date {
    return new Date(this._releaseDate);
  }

  get rating(): number {
    return this._rating;
  }

  get screenings(): ReadonlyArray<Screening> {
    return this._screenings;
  }

  // ---------- Domain behavior ----------
  updateDetails(params: {
    title?: string;
    description?: string;
    duration?: number;
    coverImage?: string | null;
    category?: string;
    releaseDate?: Date;
    rating?: number;
  }): void {
    if (params.title !== undefined) {
      this.assertNonEmpty(params.title, "title");
      this._title = params.title.trim();
    }

    if (params.description !== undefined) {
      this.assertNonEmpty(params.description, "description");
      this._description = params.description.trim();
    }

    if (params.duration !== undefined) {
      if (!Number.isInteger(params.duration) || params.duration <= 0) {
        throw new Error("Movie: duration must be an integer > 0 (minutes)");
      }
      this._duration = params.duration;
    }

    if (params.coverImage !== undefined) {
      this._coverImage = params.coverImage;
    }

    if (params.category !== undefined) {
      this.assertNonEmpty(params.category, "category");
      this._category = params.category.trim();
    }

    if (params.releaseDate !== undefined) {
      this.assertValidDate(params.releaseDate, "releaseDate");
      this._releaseDate = new Date(params.releaseDate);
    }

    if (params.rating !== undefined) {
      if (typeof params.rating !== "number" || params.rating < 0 || params.rating > 10) {
        throw new Error("Movie: rating must be between 0 and 10");
      }
      this._rating = params.rating;
    }
  }

  addScreening(screening: Screening): void {
    this._screenings.push(screening);
  }

  // ---------- Helpers ----------
  private assertNonEmpty(value: string, field: string) {
    if (!value || value.trim().length === 0) {
      throw new Error(`Movie: ${field} is required`);
    }
  }

  private assertValidDate(value: Date, field: string) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error(`Movie: ${field} must be a valid Date`);
    }
  }
}