import { Room } from "../entities/Room";

export interface IRoomRepository {
  create(room: Room): Promise<string>;
  update(room: Room): Promise<void>;
  findById(id: string): Promise<Room | null>;
  listByCinemaId(cinemaId: string): Promise<Room[]>;
}
