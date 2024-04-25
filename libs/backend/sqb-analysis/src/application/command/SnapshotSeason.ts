import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class SnapshotSeason extends Command<SnapshotSeason> {

    constructor() {
        super(undefined);
    }

    override get schema() {
        return SnapshotSeason.schema;
    }

    private static schema = z.undefined();
}
