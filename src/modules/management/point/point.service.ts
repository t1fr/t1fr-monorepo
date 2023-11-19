import { Injectable } from "@nestjs/common";
import { PointEvent, PointType } from "@/modules/management/point/point.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { isArray } from "lodash";
import { ConnectionName } from "@/constant";
import { Backup } from "@/modules/management/backup.interface";
import { GithubService } from "@/modules/github/github.service";
import { Cron } from "@nestjs/schedule";
import { RewardService } from "@/modules/management/point/subservice/reward.service";
import { Summary } from "@/modules/management/point/summary.schema";
import { PointSubservice } from "@/modules/management/point/subservice/service.interface";
import { AccountSnapshot } from "@/modules/management/point/account.snapshot.schema";
import { BaseResultData } from "@/modules/management/point/subservice/result.data";
import dayjs from "dayjs";
import { AwardData } from "@/modules/bot/option/point.option";
import { Decimal128 } from "mongodb";
import { AbsenceService } from "@/modules/management/point/subservice/absense.service";

export class PageParam {
	first: number;
	rows: number;
	member: string | null;
}

@Injectable()
export class PointService implements Backup {
	constructor(
		@InjectModel(PointEvent.name, ConnectionName.Management) private readonly pointModel: Model<PointEvent>,
		@InjectModel(Summary.name, ConnectionName.Management) private readonly summaryModel: Model<Summary>,
		@InjectModel(AccountSnapshot.name, ConnectionName.Management) private readonly snapshotModel: Model<AccountSnapshot>,
		private readonly rewardService: RewardService,
		private readonly absenceService: AbsenceService,
		private readonly githubService: GithubService,
	) {}

	async summary(userId: string) {
		const results = await this.summaryModel.findById(userId);
		if (results) return results;
		throw "查無成員";
	}

	async flush(type: PointType, data: BaseResultData[]) {
		const now = dayjs().format("YYYY-MM-DD");
		await this.pointModel.insertMany(
			data
				.filter(value => value.point !== 0)
				.map(value => ({
					type,
					date: now,
					category: "結算發放",
					comment: value.reason.join("丨"),
					delta: new Decimal128(value.point.toString()),
					member: value.owner,
				})),
		);
	}

	@Cron("02 08,20 * * *", { utcOffset: 8 })
	async backup() {
		const events = await this.pointModel.find();
		const keys: (keyof PointEvent)[] = ["date", "type", "member", "delta", "category", "comment"];
		const content = [
			keys.join(","),
			...events.map(events => [events.date, events.type, events.member, events.delta, events.category, events.comment].join(",")),
		].join("\n");

		await this.githubService.upsertFile("point_event.csv", content);
	}

	showNotCompletedAccounts(data: AccountSnapshot[]) {
		const content = [];
		content.push("以下帳號未設置帳號類型");
		data.filter(value => value.type === null).forEach(value => content.push(`> ${value._id}`));
		content.push("以下帳號未設置擁有者");
		data.filter(value => value.owner === null).forEach(value => content.push(`> ${value._id}`));
		return content;
	}

	async calculate(type: PointType, simulate: boolean | null): Promise<string[]> {
		const notCompletedAccounts = await this.snapshotModel.find({ $or: [{ type: null }, { owner: null }] });
		if (notCompletedAccounts.length > 0) return this.showNotCompletedAccounts(notCompletedAccounts);
		if (simulate === null) simulate = true;
		let service: PointSubservice | null = null;
		if (type === "獎勵") service = this.rewardService;
		else if (type === "請假") service = this.absenceService;
		const summaries = await this.summaryModel.find();
		if (!service) return [];
		const result = await service.calculate(this.snapshotModel, summaries);
		if (!simulate) this.flush(type, result);
		return service.toPost(result);
	}

	async award(data: AwardData) {
		const { delta, ...other } = data;
		this.pointModel.insertMany({ ...other, delta: new Decimal128(delta.toString()), type: "獎勵", date: dayjs().format("YYYY-MM-DD") });
	}

	async fetch(type: PointType, params: PageParam) {
		const filter = params.member ? { type, member: params.member } : { type };
		const total = await this.pointModel.count(filter);
		const logs = await this.pointModel.find(filter, { type: false }, { skip: params.first, limit: params.rows, sort: { _id: -1 } });
		return { total, logs };
	}
}
