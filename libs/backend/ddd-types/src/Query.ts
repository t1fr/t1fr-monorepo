import { IQuery } from "@nestjs/cqrs";
import { Result } from "ts-results-es";
import { DomainError } from "./DomainError";


export abstract class Query<T = unknown> implements IQuery {
    readonly data: Readonly<T> = null as T;

    constructor(data: T) {
        this.data = Object.freeze(data);
    }
}


export type QueryResult<T> = Result<T, DomainError>


