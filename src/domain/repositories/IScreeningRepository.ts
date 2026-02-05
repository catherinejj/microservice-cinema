import { Screening } from "../entities/Screening";
import { TimeRange } from "../value-objects/TimeRange";

export interface IScreeningRepository {
  create(screening: Screening): Promise<void>;
  update(screening: Screening): Promise<void>;
  findById(id: string): Promise<Screening | null>;
  listByRoomId(roomId: string, from?: Date, to?: Date): Promise<Screening[]>;
  hasOverlap(roomId: string, slot: TimeRange, excludeScreeningId?: string): Promise<boolean>;
}
