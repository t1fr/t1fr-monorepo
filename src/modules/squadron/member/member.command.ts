import { Injectable } from "@nestjs/common";
import { Context, createCommandGroupDecorator, SlashCommandContext, Subcommand } from "necord";
import { MemberRepo } from "@/modules/squadron/member/member.repo";
import { MemberType } from "@/modules/squadron/member/member-type.enum";
import { BotConfigRepo } from "@/modules/bot-config/bot-config.repo";
import { RewardService } from "@/modules/point/reward/reward.service";

const MemberCommandDecorator = createCommandGroupDecorator({
	name: "member",
	description: "管理聯隊內的 DC 帳號",
});

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {
	constructor(
		private memberRepo: MemberRepo,
		private configService: BotConfigRepo,
	) {}

	private get coreRoleId() {
		return this.configService.getValue("bot.roles.core_player");
	}

	private get casualRoleId() {
		return this.configService.getValue("bot.roles.casual_player");
	}

	@Subcommand({ name: "load", description: "將現有隊員 Discord 帳號存入資料庫" })
	async onLoadMembers(@Context() [interaction]: SlashCommandContext) {
		const members = await interaction.guild?.members.fetch();
		if (members) {
			await interaction.deferReply();
			const coreRoleId = await this.coreRoleId;
			const casualRoleId = await this.casualRoleId;
			const insertedMembers = await Promise.all(
				members.map((member) => {
					if (member.roles.cache.has(coreRoleId)) {
						return this.memberRepo.upsert({
							discordId: member.id,
							nickname: member.nickname ?? member.user.username,
							memberType: MemberType.CORE,
						});
					} else if (member.roles.cache.has(casualRoleId)) {
						return this.memberRepo.upsert({
							discordId: member.id,
							nickname: member.nickname ?? member.user.username,
							memberType: MemberType.CASUAL,
						});
					}
				}),
			);

			await interaction.followUp({
				content: `已成功將現有 ${insertedMembers.filter((value) => value !== undefined).length} 隊員存入資料庫`,
			});
		} else {
			await interaction.reply({ content: "使用命令的伺服器沒有成員" });
		}
	}

}
