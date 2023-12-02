import {GuildMember} from "discord.js";
import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {DiscordRole} from "@/constant";

export enum MemberChangeAction {
    AS_RELAXER,
    AS_FIGHTER,
    DISBAND,
}

export class MemberChangeEvent {
    constructor(readonly member: GuildMember, readonly action: MemberChangeAction) {
    }
}


@EventsHandler(MemberChangeEvent)
export class UpdateDiscordRole implements IEventHandler<MemberChangeEvent> {
    private async updateRoles(member: GuildMember, reason: string, change: { add?: string[]; remove?: string[] }) {
        const rolesManager = member.roles;
        const newRoles = rolesManager.cache
            .map(role => role.id)
            .filter(role => !change.remove?.includes(role))
            .concat(...change.add ?? []);
        return rolesManager.set(newRoles, reason);
    }

    static generateRoleChange(action: MemberChangeAction): { add?: string[], remove?: string[] } {
        switch (action) {
            case MemberChangeAction.DISBAND:
                return {remove: [DiscordRole.休閒隊員, DiscordRole.聯隊戰隊員]}
            case MemberChangeAction.AS_RELAXER:
                return {add: [DiscordRole.休閒隊員], remove: [DiscordRole.聯隊戰隊員]}
            case MemberChangeAction.AS_FIGHTER:
                return {add: [DiscordRole.聯隊戰身分群, DiscordRole.聯隊戰隊員], remove: [DiscordRole.休閒隊員]}
        }
    }

    static generateReason(action: MemberChangeAction): string {
        switch (action) {
            case MemberChangeAction.DISBAND:
                return "解除隊員身分"
            case MemberChangeAction.AS_RELAXER:
                return "休閒隊員"
            case MemberChangeAction.AS_FIGHTER:
                return "聯隊戰隊員"
        }
    }

    async handle(event: MemberChangeEvent) {
        const {member, action} = event;
        const reason = UpdateDiscordRole.generateReason(action)
        const change = UpdateDiscordRole.generateRoleChange(action)
        await this.updateRoles(member, reason, change)
    }

}