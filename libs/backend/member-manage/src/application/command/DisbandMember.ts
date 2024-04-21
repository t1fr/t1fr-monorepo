import { Command, DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { z } from "zod";

export const DisbandMemberInput = z.object({
    discordId: z.string().min(1),
});

type DisbandMemberInput = z.infer<typeof DisbandMemberInput>

export class DisbandMember extends Command<DisbandMemberInput> {
}

export type DisbandMemberOutput = Result<{ nickname: string; message: string; }, DomainError>