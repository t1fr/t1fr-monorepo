import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class DisbandMember extends Command<DisbandMember, DisbandMemberOutput> {
    override get schema() {
        return DisbandMember.schema;
    }

    private static schema = z.object({
        discordId: z.string().min(1),
    });
}

export type DisbandMemberOutput = { id: string, message: string }