import { Command, DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { z } from "zod";
import { MemberType } from "../../domain";

export const SyncMemberInput = z.array(z.object({
    discordId: z.string().min(1),
    type: z.nativeEnum(MemberType),
    nickname: z.string(),
    isOfficer: z.boolean(),
    avatarUrl: z.string().optional(),
}));

export type SyncMemberInput = z.infer<typeof SyncMemberInput>

export class SyncMember extends Command<SyncMemberInput> {
}

export type SyncMemberOutput = Result<{ errors: DomainError[] }, DomainError>