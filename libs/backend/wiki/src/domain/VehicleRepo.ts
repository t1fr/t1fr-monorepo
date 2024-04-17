import { Inject } from "@nestjs/common";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { Vehicle } from "./model";

export const VehicleRepo = () => Inject(VehicleRepo);

export type FindByNameOptions = {
    limit: number
}

export type SearchCriteria = {
    rank?: number,
    country?: string
}

export type EnumFields = Extract<keyof Vehicle["props"], "country" | "rank" | "vehicleClasses">;

export interface VehicleRepo {
    save(data: Vehicle | Vehicle[]): Promise<Result<number, DomainError>>;

    searchByName(name: string, criteria: SearchCriteria, options?: FindByNameOptions): Promise<Result<Vehicle[], DomainError>>;

    findById(id: string): Promise<Result<Vehicle, DomainError>>;

    listEnumField(field: EnumFields): Promise<Result<string[], DomainError>>;
}
