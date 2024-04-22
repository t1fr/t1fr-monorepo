import { Command, DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";

export class ScrapeAccount extends Command {
    constructor() {
        super({});
    }
}

export type ScrapeAccountOutput = Result<{
    inserted: number;
    deleted: number;
    modified: number;

    insertedIds: string[];
    deletedIds: string[];
    modifiedIds: string[];
}, DomainError>