import { Inject } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { Vehicle } from "./model";

export const VehicleRepo = () => Inject(VehicleRepo);

export type FindByNameOptions = {
    limit: number
}

export type SearchCriteria = {
    name: string,
    rank: number | null,
    country: string | null
}

export const EnumFields = ["country", "rank", "class"] as const;
export type  EnumField = typeof EnumFields[number]

export interface VehicleRepo {
    save(data: Vehicle | Vehicle[]): AsyncActionResult<number>;

    searchByName(criteria: SearchCriteria, options?: FindByNameOptions): AsyncActionResult<Vehicle[]>;

    findById(id: string): AsyncActionResult<Vehicle>;

    listEnumField(field: EnumField): AsyncActionResult<string[]>;
}
