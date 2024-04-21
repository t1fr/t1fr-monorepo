import { DomainError } from "@t1fr/backend/ddd-types";

export namespace ScrapeVehicleError {
    export class NoJsonResponseError extends DomainError {
        protected override context: string = NoJsonResponseError.name;

        constructor() {
            super({ message: `datamine JSON no response` });
        }
    }


    export class VersionNotChangeError extends DomainError {
        protected override context: string = VersionNotChangeError.name;

        constructor(version: string) {
            super({ message: `version is not changed, current: ${version}` });
        }
    }

    export class ParseDataError extends DomainError {
        protected override context: string = ParseDataError.name;

        constructor(message: string) {
            super({ message });
        }
    }

}

export namespace FindVehicleByIdError {
    export class VehicleNotFoundError extends DomainError {
        protected override context: string = VehicleNotFoundError.name;

        constructor(id: string) {
            super({ message: `Cannot find vehicle by provided id: ${id}` });
        }
    }
}