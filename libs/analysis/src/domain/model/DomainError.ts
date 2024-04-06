import { AdapterError } from "@lib/ddd-types";

export const DomainError = {} as const;

export type DomainError = typeof DomainError[keyof typeof DomainError] | AdapterError;