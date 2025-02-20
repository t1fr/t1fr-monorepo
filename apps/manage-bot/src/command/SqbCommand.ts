import { Inject, Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Backup } from "@t1fr/backend/member-manage";
import { FindCurrentSeason, GetLatestSeason, NewSeasonFromText, SnapshotCurrentSeason } from "@t1fr/backend/sqb";
import { ModalBuilder, TextInputStyle } from "discord.js";
import type { ModalContext, SlashCommandContext } from "necord";
import { Context, createCommandGroupDecorator, Ctx, Modal, Options, Subcommand } from "necord";
import { DiscordClientService, SeasonToTableHelper } from "../service";
import { configLayout } from "../utlity";
import { OptionNormalizer, SqbScheduleDisplayOption } from "./SqbOption";

const SqbCommandDecorator = createCommandGroupDecorator({ name: "sqb", description: "管理聯隊戰行程" });

@SqbCommandDecorator()
@Injectable()
export class SqbCommand {
    @Inject()
    private readonly discordClientService!: DiscordClientService;

    @Inject()
    private readonly commandBus!: CommandBus;

    @Inject()
    private readonly queryBus!: QueryBus;

    private static InputScheduleModelId = "set-schedule";

    private static inputScheduleModal = new ModalBuilder({
        title: "聯隊戰行程設置表單",
        customId: SqbCommand.InputScheduleModelId,
        components: configLayout(
            { customId: "year", label: "年份", placeholder: "該賽季的年份", style: TextInputStyle.Short, required: true },
            { customId: "text", label: "聯隊戰行程", placeholder: "請至論壇複製聯隊戰訊息", style: TextInputStyle.Paragraph, required: true },
        ),
    });

    @Subcommand({ name: "set", description: "輸入論壇聯隊戰日程，發布日程表" })
    async onSetSchedule(@Context() [interaction]: SlashCommandContext) {
        return interaction.showModal(SqbCommand.inputScheduleModal);
    }

    @Subcommand({ name: "publish", description: "更新顯示用頻道名稱" })
    async updateSqbChannelName(@Context() [interaction]: SlashCommandContext) {
        const result = await this.discordClientService.updateSqbChannelName();
        const content = result.mapOrElse(
            _error => _error,
            () => "已更新成功",
        );
        interaction.reply(content);
    }

    @Subcommand({ name: "display", description: "顯示日程表" })
    async display(@Context() [interaction]: SlashCommandContext, @Options() options: SqbScheduleDisplayOption) {
        await interaction.deferReply();

        const { inplace, notification, type } = OptionNormalizer.SqbScheduleDisplay(options);

        const result = await this.queryBus.execute(type === "current" ? new FindCurrentSeason() : new GetLatestSeason());

        if (result.isErr()) return interaction.followUp({ content: result.error.toString(), ephemeral: true });
        const table = SeasonToTableHelper.convert(result.value, notification ? this.discordClientService.constants.roles.notification.sqb : null);

        if (inplace) return interaction.followUp(table);

        const postResult = await this.discordClientService.postTableToSqbBulletin(table);
        const content = postResult.mapOrElse(
            error => `日程表發布失敗 ${error}`,
            () => "日程表發布成功",
        );

        interaction.followUp({ content, ephemeral: true });
    }

    @Subcommand({ name: "snapshot", description: "快照當前賽季各聯隊狀態以及隊員資訊" })
    async snapshot(@Context() [interaction]: SlashCommandContext) {
        await interaction.deferReply();
        const [snapshot, backup] = await Promise.all([this.commandBus.execute(new SnapshotCurrentSeason()), this.commandBus.execute(new Backup())]);
        const content = {
            snapshot: snapshot.mapOrElse(error => error.toString(), ({ year, seasonIndex }) => `已更新 ${year} 年第 ${seasonIndex} 賽季的聯隊表現紀錄`),
            backup: backup.mapOrElse(error => error.toString(), ({ year, seasonIndex }) => `已更新 ${year} 年第 ${seasonIndex} 賽季的聯隊成員備份`),
        };

        interaction.followUp([
            `聯隊資料: ${content.snapshot}`,
            `成員資料: ${content.backup}`,
        ].join("\n"));
    }

    @Modal(SqbCommand.InputScheduleModelId)
    async onModal(@Ctx() [interaction]: ModalContext) {
        await interaction.deferReply();
        const year = interaction.fields.getTextInputValue("year");
        const scheduleText = interaction.fields.getTextInputValue("text");

        const result = await this.commandBus.execute(new NewSeasonFromText({ year, text: scheduleText }));
        const content = result.mapOrElse(
            error => `儲存賽季失敗： ${error.toString()}`,
            ({ year, seasonIndex }) => `已成功建立 ${year} 年第 ${seasonIndex} 賽季`,
        );

        interaction.followUp(content);
    }
}
