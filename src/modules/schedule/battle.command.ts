import { Injectable } from "@nestjs/common";
import { Context, createCommandGroupDecorator, Ctx, Modal, ModalContext, ModalParam, Options, SlashCommandContext, Subcommand } from "necord";
import { ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { SeasonRepo } from "@/modules/schedule/season.repo";
import { BattleOption } from "@/modules/schedule/battle.option";
import { BattleService } from "@/modules/schedule/battle.service";
import dayjs from "dayjs";
import { Section } from "@/modules/schedule/season.schema";
import { configLayout } from "@/utility";

const ScheduleCommandDecorator = createCommandGroupDecorator({ name: "schedule", description: "管理聯隊戰行程" });

@ScheduleCommandDecorator()
@Injectable()
export class SetScheduleCommand {
	constructor(
		private readonly battleService: BattleService,
		private readonly sectionRepo: SeasonRepo,
	) {}

	private static components = configLayout([
		new TextInputBuilder({ customId: "year", label: "年份", placeholder: "該賽季的年份", style: TextInputStyle.Short, required: true }),
		new TextInputBuilder({
			customId: "schedule-text",
			label: "聯隊戰行程",
			placeholder: "請至論壇複製最新的聯隊戰行程",
			style: TextInputStyle.Paragraph,
			required: true,
		}),
	]);

	private createModal(isNotify: boolean) {
		return new ModalBuilder()
			.setTitle("聯隊戰行程設置表單")
			.setCustomId(`set-schedule/${isNotify ? "1" : "0"}`)
			.setComponents(SetScheduleCommand.components);
	}

	@Subcommand({ name: "set", description: "輸入論壇聯隊戰日程，發布日程表" })
	async onSetSchedule(@Context() [interaction]: SlashCommandContext, @Options() { isNotify }: BattleOption) {
		return interaction.showModal(this.createModal(isNotify));
	}

	@Subcommand({ name: "publish", description: "更新顯示用頻道名稱" })
	async onUpdateBulletin(@Context() [interaction]: SlashCommandContext) {
		const updated = await this.battleService.updateBulletin();
		await interaction.reply(updated ? "已更新成功" : "賽程表未更新，沒有當前時間的 BR 資料");
	}

	@Subcommand({ name: "display", description: "顯示日程表" })
	async display(@Context() [interaction]: SlashCommandContext) {
		const { sections } = await this.battleService.getCurrentSeason();
		const scheduleMessage = this.sectionsToTable(sections, false);
		await interaction.reply({ content: scheduleMessage });
	}

	@Modal("set-schedule//:isNotify")
	async onModal(@Ctx() [interaction]: ModalContext, @ModalParam("isNotify") isNotify: string) {
		await interaction.deferReply();
		const year = interaction.fields.getTextInputValue("year");
		const scheduleText = interaction.fields.getTextInputValue("schedule-text");
		const sections = this.parseTextToSections(year, scheduleText);
		await this.sectionRepo.upsert(sections);
		const scheduleMessage = this.sectionsToTable(sections, isNotify === "1");
		await interaction.followUp({ content: scheduleMessage });
	}

	private sectionsToTable(sections: Section[], isNotify: boolean) {
		const startMonth = sections[0].from.getUTCMonth() + 1;
		const scheduleMessage = [
			`**${startMonth} ~ ${startMonth + 1} 月**聯隊戰行程`,
			"```",
			"╭───────┬───────┬──────────╮",
			"│ Start │  End  │  Max BR  │",
			"├───────┼───────┼──────────┤",
		];

		if (isNotify) scheduleMessage.unshift("<@&1145364425658867754>");

		const sectionRows = sections.map(section => {
			const startString = dayjs(section.from).format("MM/DD");
			const endString = dayjs(section.to).format("MM/DD");
			const battleRatingString = section.battleRating.toFixed(1).padStart(6);
			return `│ ${startString} │ ${endString} │  ${battleRatingString}  │`;
		});

		sectionRows.forEach(sectionRow => {
			scheduleMessage.push(sectionRow, "├───────┼───────┼──────────┤");
		});

		scheduleMessage[scheduleMessage.length - 1] = "╰───────┴───────┴──────────╯";
		scheduleMessage.push("```");

		return scheduleMessage.join("\n");
	}

	private parseTextToSections(year: string, scheduleText: string): Section[] {
		const defaultDate = new Date(parseInt(year), 0, 1);
		const defaultSection: Section = { from: defaultDate, to: defaultDate, battleRating: 1.0 };
		const lines = scheduleText.split("\n");
		return lines
			.map(line => line.match(/(\d*\.\d*)\s*\((\d*\.\d*).*?(\d*\.\d*)\)/))
			.map(matches => {
				if (!matches) return defaultSection;
				return {
					from: dayjs.utc(`${year}.${matches[2]}`, "YYYY.DD.MM").toDate(),
					to: dayjs.utc(`${year}.${matches[3]}`, "YYYY.DD.MM").toDate(),
					battleRating: parseFloat(matches[1]),
				};
			});
	}
}
