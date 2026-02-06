import { Seat } from "../entities/Seat";

export interface ISeatRepository {
  create(seat: Seat): Promise<void>;
  createMany(seats: Seat[]): Promise<number>;

  findById(id: string): Promise<Seat | null>;
  findByRoomId(roomId: string): Promise<Seat[]>;
  existsInRoom(roomId: string, row: string, number: number): Promise<boolean>;

  update(seat: Seat): Promise<void>;
  delete(id: string): Promise<void>;
}