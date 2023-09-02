import { Inject, Injectable } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/calculate.stage.interface";
import { CalculateResult } from "@/modules/management/point/calculate-result.model";
import { AccountRepo } from "@/modules/management/account/account.repo";
import { PointRepo } from "@/modules/management/point/point.repo";
import { PointType } from "@/modules/management/point/point.schema";

@Injectable()
export class RewardService {
	constructor(
		@Inject("stages") private readonly stages: CalculateStage[],
		private readonly accountRepo: AccountRepo,
		private readonly pointRepo: PointRepo,
	) {}

	async calculate(): Promise<CalculateResult[]> {
		const inSquadAccounts = await this.accountRepo.find({ isExist: true });
		const noOwnerAccounts = inSquadAccounts.filter((account) => !account.owner);
		const noTypedAccounts = inSquadAccounts.filter((account) => !account.type);

		const error = [];

		if (noOwnerAccounts.length > 0) error.push("以下帳號未設置擁有者", ...noOwnerAccounts.map((value) => value._id));
		if (noTypedAccounts.length > 0) error.push("以下帳號未設置類型", ...noTypedAccounts.map((value) => value._id));

		if (error.length > 0) throw new Error(error.join("\n"));

		const rewardPointData: CalculateResult[] = inSquadAccounts.map((account) => ({
			id: account._id,
			type: account.type!!,
			owner: account.owner!!,
			personalRating: account.personalRating,
			point: 0,
			backup: 0,
			reasons: [],
		}));

		return this.stages.reduce((acc, val) => val.calculate(acc), rewardPointData);
	}

	async append(results: CalculateResult[]) {
		this.pointRepo.append(
			PointType.REWARD,
			results.map((result) => ({ member: result.owner, delta: result.point, comment: result.reasons.join("\n") })),
		);
	}
}
