import { OpeningHours } from "./OpeningHours";
import { Room } from "./Room";

export interface CinemaProps {
  // Prisma génère l'id (@default(cuid())) => il ne doit pas être obligatoire à la création
  id?: string;
  name: string;
  city?: string;
  rooms?: Room[];
  openingHours?: OpeningHours[];
}

export class Cinema {
  // Prisma génère l'id => peut être undefined tant que l'objet n'est pas persisté
  private readonly _id?: string;
  private _name: string;
  private _city?: string;
  private _rooms: Room[];
  private _openingHours: OpeningHours[];

  private constructor(props: CinemaProps) {
    // IMPORTANT : on ne vérifie PAS props.id ici, car Prisma le crée à l'insert
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

  get id(): string | undefined {
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
    // si tu ajoutes des rooms avant persistance, room.id peut aussi être undefined
    if (room.id && this._rooms.find((r) => r.id === room.id)) {
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