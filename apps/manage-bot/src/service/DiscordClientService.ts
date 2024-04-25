import { Inject, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Configuration } from "@t1fr/backend/configs";
import { SyncMember } from "@t1fr/backend/member-manage";
import { Client, escapeMarkdown, GuildMember, TextChannel } from "discord.js";

type PostApplicationData = { discordId: string, gameId: string, level: string, type: string }


@Injectable()
export class DiscordClientService {
    @Inject()
    private readonly client!: Client;

    @Inject()
    private readonly commandBus!: CommandBus;

    @Configuration("bot.channels.recruitment")
    private readonly recruitmentChannelId!: string;

    @Configuration("bot.guilds.t1fr")
    private readonly t1frGuildId!: string;

    @Configuration("bot.roles.officer")
    private readonly officerRoleId!: string;

    @Configuration("bot.roles.sqb")
    private readonly sqbRoleId!: string;

    @Configuration("bot.roles.relax")
    private readonly relaxRoleId!: string;


    private TransformDiscordMemberToSyncData(member: GuildMember): ConstructorParameters<typeof SyncMember>[0][number] {
        const roles = member.roles.cache;
        return {
            discordId: member.id,
            nickname: member.displayName,
            isOfficer: roles.has(this.officerRoleId),
            avatarUrl: member.displayAvatarURL({ forceStatic: true }),
            type: roles.has(this.relaxRoleId) ? "relaxer" : "squad_fighter",
        };
    }

    async postApplication({ discordId, type, gameId, level }: PostApplicationData) {
        const applyChannel = this.client.channels.resolve(this.recruitmentChannelId) as TextChannel;
        const message = await applyChannel.send({
            content: [
                `申請人： <@${discordId}>`,
                `ID： ${escapeMarkdown(gameId)}`,
                `等級： ${level}`,
                `申請隊員類型： ${type}`,
                "已閱讀並同意入隊須知： 是",
            ].join("\n"),
        });
        return message.url;
    }

    async syncMember() {
        const guild = await this.client.guilds.fetch({ guild: this.t1frGuildId, cache: true });
        if (!guild) throw Error(`不在 T1FR 伺服器 ${this.t1frGuildId}`);
        const members = await guild.members.fetch();
        if (!members) throw Error(`無法獲取成員資料`);

        const syncData = members
            .filter(member => member.roles.cache.hasAny(this.sqbRoleId, this.relaxRoleId))
            .map(member => this.TransformDiscordMemberToSyncData(member));

        const result = await this.commandBus.execute(new SyncMember(syncData));
        return result.map(({ ids, errors }) => ({ success: ids.length, errors }));
    }

}