import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class SnapshotCurrentSeason extends Command<SnapshotCurrentSeason, SnapshotSeasonOutput> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return SnapshotCurrentSeason.schema;
    }

    private static schema = z.undefined();
}

type SnapshotSeasonOutput = { year: number; seasonIndex: number };
