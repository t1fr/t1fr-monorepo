import { Command, CommandOutput } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export const AssignAccountOwnerInput = z.object({
    memberId: z.string().min(1),
    accountId: z.string().min(1),
});

type AssignAccountOwnerInput = z.infer<typeof AssignAccountOwnerInput>

export class AssignAccountOwner extends Command<AssignAccountOwnerInput> {
}

export type AssignAccountOwnerOutput = { accountName: string }

export type AssignAccountOwnerResult = CommandOutput<AssignAccountOwnerOutput>