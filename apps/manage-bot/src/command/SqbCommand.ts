import { Inject, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { NewSeasonFromText } from "@t1fr/backend/sqb-schedule";
import { ModalBuilder, TextInputStyle } from "discord.js";
import { Context, createCommandGroupDecorator, Ctx, Modal, ModalContext, SlashCommandContext, Subcommand } from "necord";
import { DiscordClientService } from "../service";
import { configLayout } from "../utlity";

const SqbCommandDecorator = createCommandGroupDecorator({ name: "sqb", description: "管理聯隊戰行程" });

@SqbCommandDecorator()
@Injectable()
export class SqbCommand {

    @Inject()
    private readonly discordClientService!: DiscordClientService;

    @Inject()
    private readonly commandBus!: CommandBus;

    private static InputScheduleModelId = "set-schedule";

    private static inputScheduleModal = new ModalBuilder({
        title: "聯隊戰行程設置表單",
        customId: SqbCommand.InputScheduleModelId,
        components: configLayout(
            { customId: "year", label: "年份", placeholder: "該賽季的年份", style: TextInputStyle.Short, required: true },
            { customId: "text", label: "聯隊戰行程", placeholder: "請至論壇聯隊戰訊息", style: TextInputStyle.Paragraph, required: true },
        ),
    });

    @Subcommand({ name: "set", description: "輸入論壇聯隊戰日程，發布日程表" })
    async onSetSchedule(@Context() [interaction]: SlashCommandContext) {
        return interaction.showModal(SqbCommand.inputScheduleModal);
    }

    @Subcommand({ name: "publish", description: "更新顯示用頻道名稱" })
    async onUpdateBulletin(@Context() [interaction]: SlashCommandContext) {
        const result = await this.discordClientService.updateBulletin();
        if (result.isOk()) interaction.reply("已更新成功");
        else interaction.reply(result.error);
    }

    @Subcommand({ name: "display", description: "顯示日程表" })
    async display(@Context() [interaction]: SlashCommandContext) {
        // const markdownTable = await this.battleService.getCurrentSeasonTable();
        // const channel = interaction.guild?.channels.resolve(Channel.聯隊戰公告);
        // const content = [`<@&${DiscordRole.推播.聯隊戰}>`, markdownTable].join("\n");
        // const message = channel?.isTextBased() ? await channel.send({ content }) : null;
        // await interaction.reply({ content: `日程表發布${message ? "成功" : "失敗"}`, ephemeral: true });
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

        if (result.isOk()) interaction.followUp({ content: `已成功建立 ${result.value.year} 年第 ${result.value.seasonIndex} 賽季` });
        else interaction.followUp({ content: `儲存賽季失敗： ${result.error.toString()}` });
    }
}
