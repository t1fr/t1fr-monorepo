import { Injectable, Logger } from "@nestjs/common";
import { Model, UpdateQuery } from "mongoose";
import { Member } from "@/modules/management/member/member.schema";
import { InjectModel } from "@nestjs/mongoose";
import { PointType } from "@/modules/management/point/point.schema";
import { ConnectionName, DiscordRole } from "@/constant";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Client, GuildMember } from "discord.js";
import { BulkWriteResult } from "mongodb";
import { Statistic } from "@/modules/management/member/statistic.schema";
import { Backup } from "@/modules/management/backup.interface";
import { GithubService } from "@/modules/github/github.service";

export type PointStatistic = Omit<Member, "isExist"> & { [key in PointType]: number };

export enum UpdateMemberAction {
	Disband = "移除隊員身分",
	ToBattle = "給予聯隊戰隊員身分",
	ToRelax = "給予休閒隊員身分",
}

@Injectable()
export class MemberService implements Backup {
	constructor(
		@InjectModel(Member.name, ConnectionName.Management) private readonly memberModel: Model<Member>,
		@InjectModel(Statistic.name, ConnectionName.Management) private readonly statisticModel: Model<Statistic>,
		private readonly client: Client,
		private readonly githubService: GithubService,
	) {}

	private readonly logger = new Logger(MemberService.name);

	static TransformDiscordMemberToMember(member: GuildMember): Member {
		return {
			_id: member.id,
			nickname: member.displayName,
			isExist: true,
			isOfficer: member.roles.cache.has(DiscordRole.軍官),
			avatarUrl: member.displayAvatarURL({ size: 32, forceStatic: true }),
		};
	}

	@Cron(CronExpression.EVERY_DAY_AT_8AM)
	async sync() {
		const guild = await this.client.guilds.fetch({ guild: "1046623840710705152", force: true });
		if (!guild) return;
		const members = await guild.members.fetch({});
		if (!members) return;

		await this.memberModel.updateMany({}, { isExist: false });
		const memberWithSquadronRole = members
			.filter(member => member.roles.cache.hasAny(DiscordRole.聯隊戰隊員, DiscordRole.休閒隊員))
			.map(MemberService.TransformDiscordMemberToMember);

		const result = await this.upsert(...memberWithSquadronRole);
		this.logger.log(["同步聯隊 DC 帳號完畢", `新增 ${result.insertedCount} 個帳號`, `更新 ${result.modifiedCount} 個帳號`].join("\n"));
	}

	async upsert(...members: Partial<Member>[]): Promise<BulkWriteResult> {
		return this.memberModel.bulkWrite(members.map(member => ({ updateOne: { filter: { _id: member._id }, update: { $set: member }, upsert: true } })));
	}

	async update(discordId: string, data: UpdateQuery<Member>) {
		await this.memberModel.findByIdAndUpdate(discordId, data);
	}

	async find(substring: string) {
		return this.memberModel.find({ isExist: true, nickname: RegExp(substring, "i") }).limit(25);
	}

	async listMemberWithStatistic() {
		const results = await this.statisticModel.find();
		return results.map<PointStatistic>(value => {
			const { points, ...other } = value.toObject();
			return { ...other, 獎勵: points?.["獎勵"] ?? 0, 請假: points?.["請假"] ?? 0, 懲罰: points?.["懲罰"] ?? 0 };
		});
	}

	async findMemberById(_id: string) {
		return this.memberModel.findOne({ _id, isExist: true });
	}

	async updateMemberState(action: UpdateMemberAction, member: GuildMember) {
		let change = { add: [] as string[], remove: [] as string[] };
		let message: string;
		if (action === UpdateMemberAction.Disband) {
			message = `已成功移除 <@${member?.id}> 隊員身分組`;
			change.remove.push(DiscordRole.休閒隊員, DiscordRole.聯隊戰隊員);
			await this.upsert({ _id: member.id, isExist: false });
		} else if (action === UpdateMemberAction.ToBattle) {
			message = MemberService.createWelcomeMessage(member, "聯隊戰");
			change.remove.push(DiscordRole.休閒隊員);
			change.add.push(DiscordRole.聯隊戰身分群, DiscordRole.聯隊戰隊員);
			await this.upsert({ _id: member.id, nickname: member.displayName });
		} else {
			change.remove.push(DiscordRole.聯隊戰隊員);
			change.add.push(DiscordRole.休閒隊員);
			message = MemberService.createWelcomeMessage(member, "休閒");
			await this.upsert({ _id: member.id, nickname: member.displayName });
		}

		try {
			await this.updateRoles(member, action, change);
			return message;
		} catch (e) {
			return `${e}`;
		}
	}

	private static createWelcomeMessage(member: GuildMember, type: "聯隊戰" | "休閒") {
		const message = [`您好，<@${member.id}>`, `您已成為 T1FR ${type}隊員`];

		if (!member.displayName.match(/^[^丨].*(丨.*)?丨.*[^丨]$/))
			message.push("請將伺服器個人暱稱用 `/nickname` 指令或手動改為：", "```", "T1FR丨您的暱稱丨您的戰雷ID", "```");

		return message.join("\n");
	}

	private async updateRoles(member: GuildMember, reason: string, change: { add: string[]; remove: string[] }) {
		const rolesManager = member.roles;
		const newRoles = rolesManager.cache
			.map(role => role.id)
			.filter(role => change.remove.includes(role))
			.concat(...change.add);
		return rolesManager.set(newRoles, reason);
	}

	@Cron("04 08,20 * * *", { utcOffset: 8 })
	async backup() {
		const members = await this.memberModel.find();
		const keys: (keyof Member)[] = ["_id", "nickname", "isOfficer", "isExist"];
		const content = [keys.join(","), ...members.map(account => [account._id, account.nickname, account.isOfficer, account.isExist].join(","))].join("\n");
		await this.githubService.upsertFile("member.csv", content);
	}
}
