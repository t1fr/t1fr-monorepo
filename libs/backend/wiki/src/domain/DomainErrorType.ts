export const DomainErrorType = {
    NotFoundVehicle: "Cannot find vehicle by provided name",
    UnknownVehicleObtainWay: "Cannot map vehicle obtain from string",
    UnknownVehicleType: "Unknown vehicle type",
    UnknownVehicleCountry: "Unknown vehicle country",
    UnknownVehicleClass: "Unknown vehicle class",
    NoDatamineJsonResponse: "Datamine JSON no response",
    VersionNotChange: "Version is not changed",
};


export class DomainError {
    static NoDatamineJsonResponse = new DomainError("NoDatamineJsonResponse");
    static VersionNotChange = new DomainError("VersionNotChange");
    constructor(readonly type: keyof typeof DomainErrorType, readonly message?: string) {
    }

    toString() {
        return `Error[${this.type}]: ${DomainErrorType[this.type]}, ${this.message}`;
    }
}