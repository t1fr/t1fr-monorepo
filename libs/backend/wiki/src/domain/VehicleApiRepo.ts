import { Inject } from "@nestjs/common";
import type { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { Vehicle } from "./model";

export const VehicleApiRepo = () => Inject(VehicleApiRepo);

export interface VehicleApiRepo {
    fromDatamine(currentVersion: string): AsyncActionResult<{ vehicles: Vehicle[], version: string }>;
}

