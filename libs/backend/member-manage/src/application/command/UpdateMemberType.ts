import { Command, DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { z } from "zod";
import { MemberType } from "../../domain";

export const UpdateMemberTypeInput = z.object({
    discordId: z.string().min(1),
    type: z.nativeEnum(MemberType),
});

type UpdateMemberTypeInput = z.infer<typeof UpdateMemberTypeInput>

export class UpdateMemberType extends Command<UpdateMemberTypeInput> {
}

export type UpdateMemberInfoOutput = Result<{ nickname: string, message: string; }, DomainError>