import { Injectable } from "@nestjs/common";
import { Context, createCommandGroupDecorator, SlashCommandContext, Subcommand } from "necord";
import { MemberRepo } from "@/modules/management/member/member.repo";
import { DiscordRole } from "@/constant";
import { GuildMember } from "discord.js";
import { Member } from "@/modules/management/member/member.schema";

const MemberCommandDecorator = createCommandGroupDecorator({
	name: "member",
	description: "管理聯隊內的 DC 帳號",
});

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {
	constructor(private memberRepo: MemberRepo) {}

	@Subcommand({ name: "load", description: "將現有隊員 Discord 帳號存入資料庫" })
	async onLoadMembers(@Context() [interaction]: SlashCommandContext) {
		const members = await interaction.guild?.members.fetch();
		if (!members) {
			interaction.reply({ content: "使用命令的伺服器沒有成員" });
			return;
		}

		interaction.deferReply();
		const result = await this.memberRepo.upsert(
			members
				.filter((member) => member.roles.cache.hasAny(DiscordRole.聯隊戰隊員, DiscordRole.休閒隊員))
				.map(MemberCommand.TransformDiscordMemberToMember),
		);

		interaction.followUp({
			content: `已成功將現有 ${result.upsertedCount} 隊員存入資料庫`,
		});
	}

	static TransformDiscordMemberToMember(member: GuildMember): Member {
		return { _id: member.id, nickname: member.nickname ?? member.displayName };
	}
}
