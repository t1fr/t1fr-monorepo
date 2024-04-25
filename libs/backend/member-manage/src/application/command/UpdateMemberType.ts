import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import { MemberType } from "../../domain";

export class UpdateMemberType extends Command<UpdateMemberType, UpdateMemberTypeOutput> {
    override get schema() {
        return UpdateMemberType.schema;
    }

    private static schema = z.object({
        discordId: z.string().min(1),
        type: z.nativeEnum(MemberType),
    });
}

export type UpdateMemberTypeOutput = { id: string, message: string; }