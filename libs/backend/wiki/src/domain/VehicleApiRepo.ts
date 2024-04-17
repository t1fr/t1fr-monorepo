import { Inject } from "@nestjs/common";
import { DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { Vehicle } from "./model";

export type ScapeDataMineResult = Result<{ vehicles: Vehicle[], version: string }, DomainError>

export interface VehicleApiRepo {
    fromDatamine(currentVersion: string): Promise<ScapeDataMineResult>;
}

export const VehicleApiRepo = () => Inject(VehicleApiRepo);