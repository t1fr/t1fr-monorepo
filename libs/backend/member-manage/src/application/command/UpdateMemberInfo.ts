import { Command, DomainError } from "@t1fr/backend/ddd-types";
import { Result } from "ts-results-es";
import { z } from "zod";

export const UpdateMemberInfoInput = z.object({
    discordId: z.string().min(1),
    nickname: z.string().optional(),
    isOfficer: z.boolean().optional(),
    isSponsor: z.boolean().optional(),
    onVacation: z.boolean().optional(),
    avatarUrl: z.string().optional(),
});

type UpdateMemberInfoInput = z.infer<typeof UpdateMemberInfoInput>

export class UpdateMemberInfo extends Command<UpdateMemberInfoInput> {
}

export type UpdateMemberInfoOutput = Result<{ nickname: string, message: string; }, DomainError>