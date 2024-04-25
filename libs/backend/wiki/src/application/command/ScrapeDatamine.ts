import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class ScrapeDatamine extends Command<ScrapeDatamine, number> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return ScrapeDatamine.schema;
    }

    private static schema = z.undefined();
}