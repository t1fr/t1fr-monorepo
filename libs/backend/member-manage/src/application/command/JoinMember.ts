import { Command, DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { z } from "zod";
import { MemberType } from "../../domain";

export const JoinMemberInput = z.object({
    discordId: z.string().min(1),
    type: z.nativeEnum(MemberType),
    nickname: z.string().min(1),
    avatarUrl: z.string(),
});

type JoinMemberInput = z.infer<typeof JoinMemberInput>

export class JoinMember extends Command<JoinMemberInput> {
}

export type JoinMemberOutput = Result<{ message: string }, DomainError>