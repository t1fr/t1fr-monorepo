import { Inject, Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Configuration } from "@t1fr/backend/configs";
import { SyncMember } from "@t1fr/backend/member-manage";
import { FindCurrentSection } from "@t1fr/backend/sqb-schedule";
import { ChannelType, Client, escapeMarkdown, GuildMember } from "discord.js";
import { Err, Ok, Result } from "ts-results-es";
import { DigitFullWidthHelper } from "./DigitFullWidthHelper";
import { DiscordClientConfig } from "./DiscordClientConfig";

type PostApplicationData = { discordId: string, gameId: string, level: string, type: string }

@Injectable()
export class DiscordClientService {
    @Inject()
    private readonly client!: Client;

    @Inject()
    private readonly commandBus!: CommandBus;

    @Inject()
    private readonly queryBus!: QueryBus;

    @Configuration("bot.constants")
    readonly constants!: DiscordClientConfig;

    private TransformDiscordMemberToSyncData(member: GuildMember): ConstructorParameters<typeof SyncMember>[0][number] {
        const roles = member.roles.cache;
        return {
            discordId: member.id,
            nickname: member.displayName,
            isOfficer: roles.has(this.constants.roles.officer),
            avatarUrl: member.displayAvatarURL({ forceStatic: true }),
            type: roles.has(this.constants.roles.relaxer) ? "relaxer" : "squad_fighter",
        };
    }

    async postApplication({ discordId, type, gameId, level }: PostApplicationData) {
        const applyChannel = this.client.channels.resolve(this.constants.channels.recruitment.apply);
        if (!applyChannel) return Err("獲取入隊申請頻道失敗");
        if (!applyChannel.isTextBased()) return Err("入隊申請頻道非文字頻道，無法張貼入隊申請");
        const message = await applyChannel.send({
            content: [
                `申請人： <@${discordId}>`,
                `ID： ${escapeMarkdown(gameId)}`,
                `等級： ${level}`,
                `申請隊員類型： ${type}`,
                "已閱讀並同意入隊須知： 是",
            ].join("\n"),
        });
        return Ok(message.url);
    }

    async syncMember() {
        const guild = await this.client.guilds.fetch({ guild: this.constants.guilds.t1fr, cache: true });
        if (!guild) throw Error(`不在 T1FR 伺服器 ${this.constants.guilds.t1fr}`);
        const members = await guild.members.fetch();
        if (!members) throw Error(`無法獲取成員資料`);

        const syncData = members
            .filter(member => member.roles.cache.hasAny(this.constants.roles.officer, this.constants.roles.relaxer))
            .map(member => this.TransformDiscordMemberToSyncData(member));

        const result = await this.commandBus.execute(new SyncMember(syncData));
        return result.map(({ ids, errors }) => ({ success: ids.length, errors }));
    }

    async updateSqbChannelName(): Promise<Result<void, string>> {
        const category = this.client.channels.resolve(this.constants.channels.sqb.category);
        const channel = this.client.channels.resolve(this.constants.channels.sqb.battlerating);

        if (!(category && category.type === ChannelType.GuildCategory)) return Err("聯隊戰類別獲取失敗");
        if (!(channel && channel.type === ChannelType.GuildVoice)) return Err("聯隊戰分房公告頻道獲取失敗");

        const findSectionOrError = await this.queryBus.execute(new FindCurrentSection());

        return findSectionOrError
            .toAsyncResult()
            .map(async ({ battleRating }) => {
                const brString = battleRating.toFixed(1).replace(/\d/g, substr => DigitFullWidthHelper.convert(substr));
                await Promise.all([channel.setName(`今日分房：${brString}`), category.setName(`聯隊戰：${brString}`)]);
            })
            .mapErr(async error => {
                await Promise.all([channel.setName("今日分房：新賽季"), category.setName(`聯隊戰`)]);
                return error.toString();
            })
            .promise;
    }

    async postTableToSqbBulletin(table: string): Promise<Result<void, string>> {
        const channel = this.client.channels.resolve(this.constants.channels.sqb.announcement);
        if (!(channel && channel.type === ChannelType.GuildText)) return Err("聯隊戰公告頻道獲取失敗");

        if (!channel.isTextBased()) return Err("聯隊戰公告頻道非文字頻道");

        return channel.send(table).then(() => Ok.EMPTY).catch(reason => Err(`${reason}`));
    }
}
