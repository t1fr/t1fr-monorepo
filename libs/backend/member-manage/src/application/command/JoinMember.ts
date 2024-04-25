import { Command } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import { MemberType } from "../../domain";

export class JoinMember extends Command<JoinMember, JoinMemberOutput> {
    override get schema() {
        return JoinMember.schema;
    }

    private static schema = z.object({
        discordId: z.string().min(1),
        type: z.nativeEnum(MemberType),
        nickname: z.string().min(1),
        avatarUrl: z.string(),
    });
}

export type JoinMemberOutput = { id: string, message: string }