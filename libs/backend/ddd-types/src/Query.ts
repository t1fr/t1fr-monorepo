import { IQuery } from "@nestjs/cqrs";


export abstract class Query<T = null> implements IQuery {
    readonly data: Readonly<T> = null as T;

    constructor(data?: T) {
        if (data) this.data = Object.freeze(data);
    }
}



