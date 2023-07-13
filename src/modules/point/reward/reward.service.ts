import { Inject, Injectable } from "@nestjs/common";
import { CalculateStage } from "@/modules/point/reward/stages/calculate.stage.interface";
import { AccountSeasonResult } from "@/modules/point/reward/account-season-result.model";
import { CalculateResult } from "@/modules/point/reward/calculate-result.model";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class RewardService {
	constructor(@Inject("stages") private readonly stages: CalculateStage[], private prisma: PrismaService) {}

	public calculate(seasonResult: AccountSeasonResult[]): CalculateResult[] {
		const rewardPointData: CalculateResult[] = seasonResult.map((account) => ({
			...account,
			point: 0,
			backup: 0,
			reasons: [],
		}));

		return this.stages.reduce((acc, val) => val.calculate(acc), rewardPointData);
	}

	public append(memberId: string, delta: number, reason: string) {
		return this.prisma.rewardPointLog.create({ data: { memberId, delta, reason } });
	}
}
