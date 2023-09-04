import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Member } from "@/modules/management/member/member.schema";
import { InjectModel } from "@nestjs/mongoose";
import { PointType } from "@/modules/management/point/point.schema";

export interface Summary {
	_id: string;
	nickname: string;
	accounts: { _id: string; activity: number; personalRating: number; type: string }[];
	points: { _id: string; sum: number; logs: { category: string; date: string; delta: number; detail: string }[] }[];
}

@Injectable()
export class MemberRepo {
	constructor(@InjectModel(Member.name) private readonly memberModel: Model<Member>) {}

	async upsert(members: Member[]) {
		return await this.memberModel.bulkWrite(members.map((member) => ({ updateOne: { filter: { _id: member._id }, update: member, upsert: true } })));
	}

	async delete(memberId: string) {
		await this.memberModel.deleteMany({ _id: memberId });
	}

	async selectAllIdAndName() {
		return this.memberModel.find();
	}

	async summary(userId: string): Promise<Summary> {
		return (
			await this.memberModel.aggregate<Summary>([
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
									logs: { $push: { category: "$category", date: "$date", delta: "$delta", detail: "$comment" } },
								},
							},
						],
					},
				},
			])
		)[0];
	}

	async listPoint(type: PointType) {
		return this.memberModel.aggregate<{ _id: string; nickname: string; sum: number }>([
			{
				$lookup: {
					from: "pointevents",
					localField: "_id",
					foreignField: "member",
					as: "points",
					pipeline: [{ $group: { _id: "$type", sum: { $sum: "$delta" } } }],
				},
			},
			{ $unwind: "$points" },
			{ $match: { "points._id": type } },
			{ $project: { nickname: true, sum: "$points.sum" } },
		]);
	}
}
