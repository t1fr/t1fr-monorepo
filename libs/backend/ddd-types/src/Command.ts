import { ICommand } from "@nestjs/cqrs";
import { Result } from "ts-results-es";
import { DomainError } from "./DomainError";

export abstract class Command<T = unknown> implements ICommand {
    readonly data: Readonly<T> = null as T;

    constructor(data: T) {
        this.data = Object.freeze(data);
    }
}


export type CommandOutput<T> = Result<T, DomainError>

