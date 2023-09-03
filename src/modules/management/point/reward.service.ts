import { Inject, Injectable } from "@nestjs/common";
import { CalculateStage } from "@/modules/management/point/stages/stage";
import { CalculateResult } from "@/modules/management/point/calculate-result.model";
import { PointRepo } from "@/modules/management/point/point.repo";
import { PointType } from "@/modules/management/point/point.schema";
import { Account } from "@/modules/management/account/account.schema";

@Injectable()
export class RewardService {
	constructor(
		@Inject("stages") private readonly stages: CalculateStage[],
		private readonly pointRepo: PointRepo,
	) {}

	async calculate(accounts: Account[]): Promise<CalculateResult[]> {
		const noOwnerAccounts = accounts.filter((account) => !account.owner);
		const noTypedAccounts = accounts.filter((account) => !account.type);

		const error = [];

		if (noOwnerAccounts.length > 0) error.push("以下帳號未設置擁有者", ...noOwnerAccounts.map((value) => value._id));
		if (noTypedAccounts.length > 0) error.push("以下帳號未設置類型", ...noTypedAccounts.map((value) => value._id));

		if (error.length > 0) throw new Error(error.join("\n"));

		const rewardPointData: CalculateResult[] = accounts.map((account) => ({
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

	async appendRaw(member: string, delta: number, reason: string) {
		await this.pointRepo.append(PointType.REWARD, { member, delta, comment: reason });
	}
}
