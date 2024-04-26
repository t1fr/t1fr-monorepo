import { Inject, Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindCurrentSeason, NewSeasonFromText } from "@t1fr/backend/sqb";
import { ModalBuilder, TextInputStyle } from "discord.js";
import { Context, createCommandGroupDecorator, Ctx, Modal, ModalContext, Options, SlashCommandContext, Subcommand } from "necord";
import { DiscordClientService, SeasonToTableHelper } from "../service";
import { configLayout } from "../utlity";
import { SqbScheduleDisplayOption } from "./SqbOption";

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
    async display(@Context() [interaction]: SlashCommandContext, @Options() { inplace, notification }: SqbScheduleDisplayOption) {
        await interaction.deferReply();

        const result = await this.queryBus.execute(new FindCurrentSeason());

        if (result.isErr()) return interaction.followUp({ content: result.error.toString(), ephemeral: true });
        const table = SeasonToTableHelper.convert(result.value, notification ? this.discordClientService.constants.roles.officer : null);

        if (inplace) return interaction.followUp(table);

        const postResult = await this.discordClientService.postTableToSqbBulletin(table);
        const content = postResult.mapOrElse(
            error => `日程表發布失敗 ${error}`,
            () => "日程表發布成功",
        );

        interaction.followUp({ content, ephemeral: true });
    }

    @Subcommand({ name: "snapshot", description: "快照當前聯隊狀態進入賽季紀錄" })
    async snapshot(@Context() [interaction]: SlashCommandContext) {
        // await interaction.deferReply();
        // await this.battleService.backup();
        // interaction.followUp({ content: "已記錄完畢" });
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
