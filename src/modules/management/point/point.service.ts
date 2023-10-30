import { Injectable } from "@nestjs/common";
import { PointEvent, PointType } from "@/modules/management/point/point.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { isArray } from "lodash";
import { ConnectionName } from "@/constant";
import { Backup } from "@/modules/management/backup.interface";
import { GithubService } from "@/modules/github/github.service";
import { Cron } from "@nestjs/schedule";
import { RewardService } from "@/modules/management/point/reward.service";

@Injectable()
export class PointService implements Backup {
	constructor(
		@InjectModel(PointEvent.name, ConnectionName.Management) private readonly pointModel: Model<PointEvent>,
		private readonly rewardService: RewardService,
		private readonly githubService: GithubService,
	) {}

	get Reward() {
		return this.rewardService;
	}

	async append(type: PointType, data: Omit<PointEvent, "type"> | Omit<PointEvent, "type">[]) {
		if (isArray(data)) {
			await this.pointModel.insertMany(data.map(value => ({ type, ...value })));
		} else {
			await this.pointModel.insertMany({ type, ...data });
		}
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
}