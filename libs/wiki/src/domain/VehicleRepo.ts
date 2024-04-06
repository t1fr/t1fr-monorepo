import { Inject } from "@nestjs/common";
import { Result } from "ts-results-es";
import { Vehicle } from "./model";
import { DomainError } from "./DomainError";

export const VehicleRepo = () => Inject(VehicleRepo);

export type FindByNameOptions = {
	limit: number
}

export interface VehicleRepo {
	save(data: Vehicle | Vehicle[]): Promise<Result<void, DomainError>>;

	searchByName(name: string, options?: FindByNameOptions): Promise<Result<Vehicle[], DomainError>>;

	findByKey(key: string): Promise<Result<Vehicle, DomainError>>;
}