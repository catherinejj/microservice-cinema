import { Cinema } from "../entities/Cinema";

export interface ICinemaRepository {
  create(cinema: Cinema): Promise<void>;
  update(cinema: Cinema): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Cinema | null>;
  list(): Promise<Cinema[]>;
}
