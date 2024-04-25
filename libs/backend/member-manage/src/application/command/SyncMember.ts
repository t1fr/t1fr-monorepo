import { Command, DomainError } from "@t1fr/backend/ddd-types";
import { z } from "zod";
import { MemberType } from "../../domain";


export class SyncMember extends Command<SyncMember, SyncMemberOutput> {
    override get schema() {
        return SyncMember.schema;
    }

    private static schema = z.object({
        discordId: z.string().min(1),
        type: z.nativeEnum(MemberType),
        nickname: z.string(),
        isOfficer: z.boolean(),
        avatarUrl: z.string().optional(),
    }).array();
}

export type SyncMemberOutput = { ids: string[], errors: DomainError[] }