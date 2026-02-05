export interface SeatProps {
  // Prisma génère l'id (@default(cuid())) => pas obligatoire à la création
  id?: string;

  roomId: string;
  row: string;
  number: number;
}

export class Seat {
  private readonly _id?: string; // optional tant que non persisté
  private readonly _roomId: string;
  private _row: string;
  private _number: number;

  private constructor(props: SeatProps) {
    // IMPORTANT : on ne vérifie PAS props.id ici, car Prisma le crée à l'insert
    if (!props.roomId) throw new Error("Seat: roomId is required");

    if (!props.row || props.row.trim().length === 0) {
      throw new Error("Seat: row is required");
    }

    if (!Number.isInteger(props.number) || props.number <= 0) {
      throw new Error("Seat: number must be an integer > 0");
    }

    this._id = props.id;
    this._roomId = props.roomId;
    this._row = props.row.trim().toUpperCase();
    this._number = props.number;
  }

  static create(props: SeatProps): Seat {
    return new Seat(props);
  }

  get id(): string | undefined {
    return this._id;
  }

  get roomId(): string {
    return this._roomId;
  }

  get row(): string {
    return this._row;
  }

  get number(): number {
    return this._number;
  }

  samePositionAs(other: Seat): boolean {
    return (
      this._roomId === other._roomId &&
      this._row === other._row &&
      this._number === other._number
    );
  }

  toString(): string {
    return `Row ${this._row} Seat ${this._number}`;
  }
}