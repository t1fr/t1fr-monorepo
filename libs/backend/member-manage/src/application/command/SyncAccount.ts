import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class SyncAccount extends Command<SyncAccount, void> {
    override get schema() {
        return SyncAccount.schema;
    }

    private static schema = z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        personalRating: z.number(),
        activity: z.number(),
        joinDate: z.date(),
    }).array();
}