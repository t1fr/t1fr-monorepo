import { Injectable } from "@nestjs/common";
import { Context, Ctx, Modal, ModalContext, ModalParam, Options, SlashCommand, SlashCommandContext } from "necord";
import {
	ActionRowBuilder,
	ChannelType,
	Client,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextChannel,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import * as moment from "moment";
import { BotConfigRepo } from "@/modules/bot-config/bot-config.repo";
import { SectionRepo } from "@/modules/battle-schedule/section.repo";
import { SetScheduleOption } from "@/modules/battle-schedule/set-schedule.option";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SetScheduleCommand {
	constructor(private dynamicConfigService: BotConfigRepo, private sectionRepo: SectionRepo, private readonly client: Client) {}

	private scheduleTextInput = new TextInputBuilder()
		.setCustomId("schedule-text")
		.setLabel("聯隊戰行程")
		.setPlaceholder("請至戰雷論壇複製最新的聯隊戰行程")
		.setStyle(TextInputStyle.Paragraph)
		.setRequired();

	private yearTextInput = new TextInputBuilder()
		.setCustomId("year")
		.setLabel("年份")
		.setPlaceholder("該賽季的年份")
		.setStyle(TextInputStyle.Short)
		.setRequired()
		.setValue(moment().year().toString());

	private secondRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(this.scheduleTextInput);

	private firstRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(this.yearTextInput);

	private createModal(isNotify: boolean) {
		return new ModalBuilder()
			.setTitle("聯隊戰行程設置表單")
			.setCustomId(`set-sechedule/${isNotify ? "1" : "0"}`)
			.setComponents([this.firstRow, this.secondRow]);
	}

	@SlashCommand({ name: "set-schedule", description: "輸入論壇聯隊戰日程，發布日程表" })
	async onSetSchedule(@Context() [interaction]: SlashCommandContext, @Options() { isNotify }: SetScheduleOption) {
		return interaction.showModal(this.createModal(isNotify));
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { utcOffset: 0 })
	@SlashCommand({ name: "update-bulletin", description: "更新顯示用頻道名稱" })
	async onUpdateBulletin(@Context() [interaction]: SlashCommandContext) {
		const section = await this.sectionRepo.getCurrentSection();
		const messages = { reply: "賽程表未更新，沒有當前時間的 BR 資料", category: "聯隊戰", announcement: "今日分房：新賽季" };
		if (section) {
			const brString = section.battleRating.toFixed(1).replace(/\d/g, digitToFullwidth);
			messages.reply = "已更新成功";
			messages.announcement = `今日分房：${brString}`;
			messages.category = `聯隊戰：${brString}`;
		}
		const category = this.client.channels.resolve("1046624503276515339");
		if (category && category.type === ChannelType.GuildCategory) {
			category.setName(messages.category);
		}

		const channel = this.client.channels.resolve("1047751571708051486");
		if (channel && channel.type === ChannelType.GuildVoice) {
			channel.setName(messages.announcement);
		}

		if (interaction) interaction.reply(messages.reply);
	}

	@Modal("set-sechedule/:isNotify")
	async onModal(@Ctx() [interaction]: ModalContext, @ModalParam("isNotify") isNotify: string) {
		await interaction.deferReply();
		const year = interaction.fields.getTextInputValue("year");
		const schduleText = interaction.fields.getTextInputValue("schedule-text");
		const sections = this.parseTextToSections(year, schduleText);
		const savedSections = await Promise.all(sections.map((section) => this.sectionRepo.upsert(section)));
		const scheduleMessage = this.sectionsToTable(savedSections, isNotify === "1");
		await interaction.followUp({ content: scheduleMessage });
	}

	private sectionsToTable(sections: Section[], isNotify: boolean) {
		const startMonth = sections[0].from.getMonth() + 1;
		const scheduleMessage = [] as string[];

		if (isNotify) {
			scheduleMessage.push(`<@&${this.dynamicConfigService.getValue("bot.roles.core_player")}>`);
		}

		scheduleMessage.push(`**${startMonth} ~ ${startMonth + 1} 月**聯隊戰行程`);

		scheduleMessage.push(
			"```",
			"╭─────────┬─────────┬──────────╮",
			"│  Start  │   End   │  Max BR  │",
			"├─────────┼─────────┼──────────┤",
		);

		const sectionRows = sections.map((section) => {
			const startString = moment(section.from).format("MM/DD");
			const endString = moment(section.to).format("MM/DD");
			const battleRatingString = section.battleRating.toFixed(1).padStart(6);
			return `│  ${startString}  │  ${endString}  │  ${battleRatingString}  │`;
		});

		sectionRows.forEach((sectionRow) => {
			scheduleMessage.push(sectionRow, "├─────────┼─────────┼──────────┤");
		});

		scheduleMessage[scheduleMessage.length - 1] = "╰─────────┴─────────┴──────────╯";
		scheduleMessage.push("```");

		return scheduleMessage.join("\n");
	}

	private parseTextToSections(year: string, scheduleText: string): Section[] {
		const defaultDate = new Date(parseInt(year), 0, 1);
		const defaultSection = new Section(defaultDate, defaultDate, 1.0);
		const lines = scheduleText.split("\n");
		return lines
			.map((line) => line.match(/(\d*\.\d*)\s*\((\d*\.\d*).*?(\d*\.\d*)\)/))
			.map((matches) =>
				matches
					? new Section(
							moment(`${year}.${matches[2]}`, "YYYY.DD.MM").toDate(),
							moment(`${year}.${matches[3]}`, "YYYY.DD.MM").toDate(),
							parseFloat(matches[1]),
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  )
					: defaultSection,
			);
	}
}

class Section {
	constructor(public from: Date, public to: Date, public battleRating: number) {}
}

const digitFullwidthMap = {
	"0": "０",
	"1": "１",
	"2": "２",
	"3": "３",
	"4": "４",
	"5": "５",
	"6": "６",
	"7": "７",
	"8": "８",
	"9": "９",
};

function digitToFullwidth(digit: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") {
	return digitFullwidthMap[digit];
}
