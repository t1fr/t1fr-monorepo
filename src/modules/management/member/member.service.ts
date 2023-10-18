import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Model, Promise, UpdateQuery } from "mongoose";
import { Member } from "@/modules/management/member/member.schema";
import { InjectModel } from "@nestjs/mongoose";
import { PointType } from "@/modules/management/point/point.schema";
import { ConnectionName, DiscordRole } from "@/constant";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Client, GuildMember } from "discord.js";
import { BulkWriteResult } from "mongodb";
import { result } from "lodash";

export interface Summary {
	_id: string;
	nickname: string;
	accounts: { _id: string; activity: number; personalRating: number; type: string }[];
	points: { _id: string; sum: number; logs: { category: string; date: string; delta: number; detail: string }[] }[];
}

export type PointStatistic = Omit<Member, "isExist"> & { [key in PointType]: number };

@Injectable()
export class MemberService {
	constructor(
		@InjectModel(Member.name, ConnectionName.Management) private readonly memberModel: Model<Member>,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(MemberService.name);

	static TransformDiscordMemberToMember(member: GuildMember): Member {
		return {
			_id: member.id,
			nickname: member.displayName,
			isExist: true,
			isOfficer: member.roles.cache.has(DiscordRole.軍官),
			avatarUrl: member.displayAvatarURL({ size: 128, forceStatic: true }),
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

		const result = await this.upsert(memberWithSquadronRole);
		this.logger.log(["同步聯隊 DC 帳號完畢", `新增 ${result.insertedCount} 個帳號`, `更新 ${result.modifiedCount} 個帳號`].join("\n"));
	}

	async upsert(members: Member[]): Promise<BulkWriteResult> {
		return this.memberModel.bulkWrite(members.map(member => ({ updateOne: { filter: { _id: member._id }, update: member, upsert: true } })));
	}

	async update(discordId: string, data: UpdateQuery<Member>) {
		await this.memberModel.findByIdAndUpdate(discordId, data);
	}

	async find(substring: string) {
		return this.memberModel.find({ isExist: true, nickname: RegExp(substring, "i") }).limit(25);
	}

	async summary(userId: string) {
		const results = await this.memberModel.aggregate<Summary>([
			{ $match: { _id: userId } },
			{
				$lookup: {
					from: "accounts",
					localField: "_id",
					foreignField: "owner",
					as: "accounts",
					pipeline: [{ $project: { type: true, personalRating: true, activity: true } }],
				},
			},
			{
				$lookup: {
					from: "pointevents",
					localField: "_id",
					foreignField: "member",
					as: "points",
					pipeline: [
						{
							$group: {
								_id: "$type",
								sum: { $sum: "$delta" },
								logs: { $push: { category: "$category", date: "$date", delta: { $toDouble: "$delta" }, detail: "$comment" } },
							},
						},
						{
							$set: { sum: { $toDouble: "$sum" } },
						},
					],
				},
			},
		]);

		if (results.length) return results[0];
		throw "查無成員";
	}

	async listMemberWithStatistic() {
		const results = await this.memberModel.aggregate<Member & { points: { [key in PointType]: number } }>([
			{ $match: { isExist: true } },
			{ $unset: "isExist" },
			{
				$lookup: {
					from: "pointevents",
					localField: "_id",
					foreignField: "member",
					as: "points",
					pipeline: [{ $group: { _id: "$type", sum: { $sum: "$delta" } } }],
				},
			},
			{ $set: { points: { $arrayToObject: { $map: { input: "$points", in: { k: "$$this._id", v: { $toDouble: "$$this.sum" } } } } } } },
		]);

		return results.map<PointStatistic>(value => {
			const { points, isExist, ...other } = value;
			return { ...other, 獎勵: points["獎勵"] ?? 0, 請假: points["請假"] ?? 0, 懲罰: points["懲罰"] ?? 0 };
		});
	}

	async findMemberById(_id: string) {
		return this.memberModel.findOne({ _id, isExist: true });
	}
}
