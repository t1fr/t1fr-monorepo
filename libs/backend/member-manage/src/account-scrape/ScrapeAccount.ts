import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class ScrapeAccount extends Command<ScrapeAccount, ScrapeAccountOutput> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return ScrapeAccount.schema;
    }

    private static schema = z.undefined();
}

export type ScrapeAccountOutput = {
    inserted: number;
    deleted: number;
    modified: number;

    ids: string[];
}