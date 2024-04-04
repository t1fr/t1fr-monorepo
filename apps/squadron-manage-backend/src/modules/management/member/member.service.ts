import { Injectable, Logger } from "@nestjs/common";
import { Model, UpdateQuery } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Client, GuildMember } from "discord.js";
import { BulkWriteResult } from "mongodb";
import { PointType } from "../point/point.schema";
import { Backup } from "../backup.interface";
import { ConnectionName, DiscordRole } from "../../../constant";
import { Statistic } from "./statistic.schema";
import { GithubService } from "../../github/github.service";
import { Member } from "./member.schema";

export type PointStatistic = Omit<Member, "isExist"> & { [key in PointType]: number };

@Injectable()
export class MemberService implements Backup {
	constructor(
		@InjectModel(Member.name, ConnectionName.Management) private readonly memberModel: Model<Member>,
		@InjectModel(Statistic.name, ConnectionName.Management) private readonly statisticModel: Model<Statistic>,
		private readonly client: Client,
		private readonly githubService: GithubService,
	) {
	}

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
		return this.memberModel.bulkWrite(members.map(member => ({
			updateOne: {
				filter: { _id: member._id },
				update: { $set: member },
				upsert: true,
			},
		})));
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


	@Cron("04 08,20 * * *", { utcOffset: 8 })
	async backup() {
		const members = await this.memberModel.find();
		const keys: (keyof Member)[] = ["_id", "nickname", "isOfficer", "isExist"];
		const content = [keys.join(","), ...members.map(account => [account._id, account.nickname, account.isOfficer, account.isExist].join(","))].join("\n");
		await this.githubService.upsertFile("member.csv", content);
	}
}
