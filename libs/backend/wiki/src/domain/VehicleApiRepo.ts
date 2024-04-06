import { Result } from "ts-results-es";
import { Vehicle } from "./model";
import { Inject } from "@nestjs/common";
import { DomainError } from "./DomainError";

export interface VehicleApiRepo {
	fromDatamine(currentVersion: string): Promise<Result<{ vehicles: Vehicle[], version: string }, DomainError>>;
}

export const VehicleApiRepo = () => Inject(VehicleApiRepo);