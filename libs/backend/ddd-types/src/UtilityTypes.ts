import { AsyncResult, Result } from "ts-results-es";
import { DomainError } from "./DomainError";

export type Undefinedable<T, K extends keyof T> = Required<Omit<T, K>> & { [P in keyof Pick<T, K>]: T[P] | undefined }

export type AsyncActionResult<T, E = DomainError> = AsyncResult<T, E>

export type ActionResult<T, E = DomainError> = Result<T, E>