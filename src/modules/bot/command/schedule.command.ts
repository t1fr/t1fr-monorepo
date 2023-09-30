import { Injectable } from "@nestjs/common";
import { BooleanOption, Context, createCommandGroupDecorator, Ctx, Modal, ModalContext, Options, SlashCommandContext, Subcommand } from "necord";
import { ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ScheduleService } from "@/modules/schedule/schedule.service";
import { configLayout } from "@/modules/bot/utility";
import { Channel, DiscordRole } from "@/constant";

const ScheduleCommandDecorator = createCommandGroupDecorator({ name: "schedule", description: "管理聯隊戰行程" });

@ScheduleCommandDecorator()
@Injectable()
export class ScheduleCommand {
	constructor(private readonly battleService: ScheduleService) {}

	static inputScheduleModal = new ModalBuilder({
		title: "聯隊戰行程設置表單",
		customId: `set-schedule`,
		components: configLayout([
			new TextInputBuilder({ customId: "year", label: "年份", placeholder: "該賽季的年份", style: TextInputStyle.Short, required: true }),
			new TextInputBuilder({ customId: "raw", label: "聯隊戰行程", placeholder: "請至論壇聯隊戰訊息", style: TextInputStyle.Paragraph, required: true }),
		]),
	});

	@Subcommand({ name: "set", description: "輸入論壇聯隊戰日程，發布日程表" })
	async onSetSchedule(@Context() [interaction]: SlashCommandContext) {
		return interaction.showModal(ScheduleCommand.inputScheduleModal);
	}

	@Subcommand({ name: "publish", description: "更新顯示用頻道名稱" })
	async onUpdateBulletin(@Context() [interaction]: SlashCommandContext) {
		const updated = await this.battleService.updateBulletin();
		await interaction.reply(updated ? "已更新成功" : "賽程表未更新，沒有當前時間的 BR 資料");
	}

	@Subcommand({ name: "display", description: "顯示日程表" })
	async display(@Context() [interaction]: SlashCommandContext) {
		const markdownTable = await this.battleService.getCurrentSeasonTable();
		const channel = interaction.guild?.channels.resolve(Channel.聯隊戰公告);
		const content = [`<@${DiscordRole.推播.聯隊戰}`, markdownTable].join("\n");
		const message = channel?.isTextBased() ? await channel.send({ content }) : null;
		await interaction.reply({ content: `日程表發布${message ? "成功" : "失敗"}`, ephemeral: true });
	}

	@Modal("set-schedule")
	async onModal(@Ctx() [interaction]: ModalContext) {
		await interaction.deferReply();
		const year = interaction.fields.getTextInputValue("year");
		const scheduleText = interaction.fields.getTextInputValue("raw");

		try {
			await this.battleService.upsertSeason(year, scheduleText);
			interaction.followUp({ content: "已成功儲存此賽季" });
		} catch (error) {
			interaction.followUp({ content: `儲存賽季失敗：${error}` });
		}
	}
}
