import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";

export class UpdateMemberInfo extends Command<UpdateMemberInfo, UpdateMemberInfoOutput> {
    override get schema() {
        return UpdateMemberInfo.schema;
    }

    private static schema = z.object({
        discordId: z.string().min(1),
        nickname: z.string().optional(),
        isOfficer: z.boolean().optional(),
        isSponsor: z.boolean().optional(),
        onVacation: z.boolean().optional(),
        avatarUrl: z.string().optional(),
    });
}

export type UpdateMemberInfoOutput = { id: string, message: string; }