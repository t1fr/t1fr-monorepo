import { DomainError } from "@t1fr/backend/ddd-types";

export namespace ScrapeVehicleError {
    export class UnknownVehicleTypeError extends DomainError {
        constructor(type: string) {
            super({ message: `unknown vehicle type: ${type}` });
        }
    }

    export class UnknownVehicleObtainWayError extends DomainError {
        constructor(obtainSource: string) {
            super({ message: `unknown vehicle obtain source: ${obtainSource}` });
        }
    }

    export class UnknownVehicleClassError extends DomainError {
        constructor(vehicleClass: string[]) {
            super({ message: `unknown vehicle class: ${vehicleClass.join(", ")}` });
        }
    }


    export class UnknownVehicleCountryError extends DomainError {
        constructor(country: string) {
            super({ message: `unknown vehicle country: ${country}` });
        }
    }

    export class NoJsonResponseError extends DomainError {
        constructor() {
            super({ message: `datamine JSON no response` });
        }
    }


    export class VersionNotChangeError extends DomainError {
        constructor(version: string) {
            super({ message: `version is not changed, current: ${version}` });
        }
    }

    export class ParseDataError extends DomainError {
        constructor(message: string) {
            super({ message });
        }
    }

}

export namespace FindVehicleByIdError {
    export class VehicleNotFoundError extends DomainError {
        constructor(id: string) {
            super({ message: `Cannot find vehicle by provided id: ${id}` });
        }
    }
}