import { ICommand } from "@nestjs/cqrs";

export abstract class Command<T = unknown> implements ICommand {
    readonly data: Readonly<T> = null as T;

    constructor(data?: T) {
        if (data) this.data = Object.freeze(data);
    }
}



