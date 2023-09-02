import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Member } from "@/modules/management/member/member.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class MemberRepo {
	constructor(@InjectModel(Member.name) private readonly memberModel: Model<Member>) {}

	async upsert(members: Member[]) {
		return await this.memberModel.bulkWrite(members.map((member) => ({ updateOne: { filter: { _id: member._id }, update: member, upsert: true } })));
	}

	async selectAllIdAndName() {
		return this.memberModel.find();
	}
}
