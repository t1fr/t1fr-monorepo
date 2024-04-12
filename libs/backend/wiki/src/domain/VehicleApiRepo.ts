import { Inject } from "@nestjs/common";
import { Result } from "ts-results-es";
import { DomainError } from "./DomainError";
import { Vehicle } from "./model";

export interface VehicleApiRepo {
    fromDatamine(currentVersion: string): Promise<Result<{ vehicles: Vehicle[], version: string }, DomainError[]>>;
}

export const VehicleApiRepo = () => Inject(VehicleApiRepo);