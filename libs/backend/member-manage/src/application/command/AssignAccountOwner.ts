import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class AssignAccountOwner extends Command<AssignAccountOwner, AssignAccountOwnerOutput> {
    override get schema() {
        return AssignAccountOwner.schema;
    }

    private static schema = z.object({
        memberId: z.string().min(1),
        accountId: z.string().min(1),
    });
}

export type AssignAccountOwnerOutput = {
    account: { id: string, name: string }
    newOwnerId: string;
    oldOwnerId?: string;
}