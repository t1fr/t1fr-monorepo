import { DomainError } from "@t1fr/backend/ddd-types";

export namespace ScrapeVehicleError {
    export class NoJsonResponseError extends DomainError {
        constructor() {
            super({ context: NoJsonResponseError, message: `datamine JSON no response` });
        }
    }


    export class VersionNotChangeError extends DomainError {
        constructor(version: string) {
            super({ context: VersionNotChangeError, message: `version is not changed, current: ${version}` });
        }
    }
}

export namespace FindVehicleByIdError {
    export class VehicleNotFoundError extends DomainError {
        constructor(id: string) {
            super({ context: VehicleNotFoundError, message: `Cannot find vehicle by provided id: ${id}` });
        }
    }
}