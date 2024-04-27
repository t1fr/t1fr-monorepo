import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class Backup extends Command<Backup, BackupOutput> {
    constructor() {
        super(undefined);
    }

    override get schema() {
        return z.undefined();
    }
}

export type BackupOutput = {
    year: number;
    seasonIndex: number;
}