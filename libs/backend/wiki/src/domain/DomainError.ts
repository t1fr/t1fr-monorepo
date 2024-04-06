import { AdapterError } from "@t1fr/backend/ddd-types";

export const DomainError = {
	NotFoundVehicle: "Cannot find vehicle by provided name",
	UnknownVehicleObtainWay: "Cannot map vehicle obtain from string",
	NoDatamineJsonResponse: "Datamine JSON no response",
	VersionNotChange: "Version is not changed",
} as const;

export type DomainError = (typeof DomainError[keyof typeof DomainError]) | AdapterError;
