import { Cinema } from "../entities/Cinema";

export interface ICinemaRepository {
  create(cinema: Cinema): Promise<void>;
  update(cinema: Cinema): Promise<void>;
  findById(id: string): Promise<Cinema | null>;
  list(): Promise<Cinema[]>;
}
