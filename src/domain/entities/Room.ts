import { Screening } from "./Screening";
import { Seat } from "./Seat";

export interface RoomProps {
  id: string;
  cinemaId: string;
  name: string;
  capacitySeat: number;

  seats?: Seat[];
  screenings?: Screening[];
}

export class Room {
  private readonly _id: string;
  private readonly _cinemaId: string;

  private _name: string;
  private _capacitySeat: number;

  private _seats: Seat[];
  private _screenings: Screening[];

  private constructor(props: RoomProps) {
    if (!props.id) throw new Error("Room: id is required");
    if (!props.cinemaId) throw new Error("Room: cinemaId is required");

    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Room: name is required");
    }

    if (!Number.isInteger(props.capacitySeat) || props.capacitySeat <= 0) {
      throw new Error("Room: capacitySeat must be an integer > 0");
    }

    this._id = props.id;
    this._cinemaId = props.cinemaId;
    this._name = props.name.trim();
    this._capacitySeat = props.capacitySeat;

    this._seats = props.seats ?? [];
    this._screenings = props.screenings ?? [];
  }

  // ---------- Factory ----------
  static create(props: RoomProps): Room {
    return new Room(props);
  }

  // ---------- Getters ----------
  get id(): string {
    return this._id;
  }

  get cinemaId(): string {
    return this._cinemaId;
  }

  get name(): string {
    return this._name;
  }

  get capacitySeat(): number {
    return this._capacitySeat;
  }

  get seats(): ReadonlyArray<Seat> {
    return this._seats;
  }

  get screenings(): ReadonlyArray<Screening> {
    return this._screenings;
  }

  // ---------- Domain behavior ----------
  rename(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error("Room: name cannot be empty");
    }
    this._name = newName.trim();
  }

  changeCapacity(newCapacity: number): void {
    if (!Number.isInteger(newCapacity) || newCapacity <= 0) {
      throw new Error("Room: capacitySeat must be an integer > 0");
    }

    // règle "soft" : si tu as déjà des sièges connus, la capacité ne doit pas être < nb sièges
    if (this._seats.length > 0 && newCapacity < this._seats.length) {
      throw new Error(
        `Room: capacitySeat (${newCapacity}) cannot be less than number of seats (${this._seats.length})`
      );
    }

    this._capacitySeat = newCapacity;
  }

  addSeat(seat: Seat): void {
    // si tu veux, on pourra rendre ça plus strict après (row/number unique)
    if (this._seats.find((s) => s.id === seat.id)) {
      throw new Error(`Room: seat ${seat.id} already exists`);
    }
    this._seats.push(seat);
  }

  addScreening(screening: Screening): void {
    if (screening.roomId !== this._id) {
      throw new Error("Room: cannot add a screening for a different room");
    }
    this._screenings.push(screening);
  }
}