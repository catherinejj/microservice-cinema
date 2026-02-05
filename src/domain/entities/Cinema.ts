import { OpeningHours } from "./OpeningHours";
import { Room } from "./Room";

export interface CinemaProps {
  id: string;
  name: string;
  city?: string;
  rooms?: Room[];
  openingHours?: OpeningHours[];
}

export class Cinema {
  private readonly _id: string;
  private _name: string;
  private _city?: string;
  private _rooms: Room[];
  private _openingHours: OpeningHours[];

  private constructor(props: CinemaProps) {
    if (!props.id) throw new Error("Cinema: id is required");
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Cinema: name is required");
    }

    this._id = props.id;
    this._name = props.name.trim();
    this._city = props.city;
    this._rooms = props.rooms ?? [];
    this._openingHours = props.openingHours ?? [];
  }

  static create(props: CinemaProps): Cinema {
    return new Cinema(props);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get city(): string | undefined {
    return this._city;
  }

  get rooms(): ReadonlyArray<Room> {
    return this._rooms;
  }

  get openingHours(): ReadonlyArray<OpeningHours> {
    return this._openingHours;
  }

  rename(newName: string) {
    if (!newName || newName.trim().length === 0) {
      throw new Error("Cinema: name cannot be empty");
    }
    this._name = newName.trim();
  }

  moveToCity(city?: string) {
    this._city = city;
  }

  addRoom(room: Room) {
    if (this._rooms.find((r) => r.id === room.id)) {
      throw new Error(`Cinema: room ${room.id} already exists`);
    }
    this._rooms.push(room);
  }

  setOpeningHours(hours: OpeningHours[]) {
    this._openingHours = [...hours];
  }

  isOpenAt(date: Date): boolean {
    const jsDay = date.getDay(); // 0=Sunday, 1=Monday...
    const hours = this._openingHours.find((h) => h.matchesDay(jsDay));
    if (!hours) return false;
    return hours.isOpenAt(date);
  }
}