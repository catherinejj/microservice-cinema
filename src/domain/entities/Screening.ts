import { Money } from "../value-objects/Money";
import { TimeRange } from "../value-objects/TimeRange";
import { Seat } from "./Seat";

export interface ScreeningProps {
  // Prisma génère l'id (@default(cuid())) => pas obligatoire à la création
  id?: string;

  movieId: string;
  roomId: string;
  slot: TimeRange;
  price: Money;
}

export class Screening {
  private readonly _id?: string; // optional tant que non persisté
  private readonly _movieId: string;
  private readonly _roomId: string;
  private _slot: TimeRange;
  private _price: Money;

  private constructor(props: ScreeningProps) {
    // IMPORTANT : on ne vérifie PAS props.id ici, car Prisma le crée à l'insert
    if (!props.movieId) throw new Error("Screening: movieId is required");
    if (!props.roomId) throw new Error("Screening: roomId is required");

    this._id = props.id;
    this._movieId = props.movieId;
    this._roomId = props.roomId;
    this._slot = props.slot;
    this._price = props.price;
  }

  // ---------- Factory ----------
  static create(props: ScreeningProps): Screening {
    return new Screening(props);
  }

  // ---------- Getters ----------
  get id(): string | undefined {
    return this._id;
  }

  get movieId(): string {
    return this._movieId;
  }

  get roomId(): string {
    return this._roomId;
  }

  get slot(): TimeRange {
    return this._slot;
  }

  get price(): Money {
    return this._price;
  }

  // ---------- Domain behavior ----------
  overlapsWith(other: Screening): boolean {
    if (this._roomId !== other._roomId) {
      return false;
    }
    return this._slot.overlaps(other._slot);
  }

  changePrice(newPrice: Money) {
    this._price = newPrice;
  }

  reschedule(newSlot: TimeRange) {
    this._slot = newSlot;
  }

  // Est-ce que le screening se déroule dans la même salle que le siège donné en paramètre
  belongsToSameRoom(seat: Seat): boolean {
    return seat.roomId === this._roomId;
  }
}