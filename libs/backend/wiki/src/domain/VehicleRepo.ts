import { Inject } from "@nestjs/common";
import { Result } from "ts-results-es";
import { DomainError } from "./DomainError";
import { Vehicle } from "./model";

export const VehicleRepo = () => Inject(VehicleRepo);

export type FindByNameOptions = {
  limit: number
}

export type SearchCriteria = {
  rank?: number,
  country?: string
}

export interface VehicleRepo {
  save(data: Vehicle | Vehicle[]): Promise<Result<void, DomainError>>;

  searchByName(name: string, criteria: SearchCriteria, options?: FindByNameOptions): Promise<Result<Vehicle[], DomainError>>;

  findById(id: string): Promise<Result<Vehicle, DomainError>>;
}
