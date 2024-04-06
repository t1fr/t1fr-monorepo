import { Result } from "ts-results-es";

export const AdapterError = {
	PersistError: "Convert to Persist Model Error",
	RestoreError: "Convert to Domain Model Error",
} as const;

export type  AdapterError = typeof AdapterError[keyof typeof AdapterError]

export interface Adapter<TDomain, TPersist, TError = string> {
	persist(model: TDomain): Result<TPersist, TError>;

	restore(model: TPersist): Result<TDomain, TError>;
}

