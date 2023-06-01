import { Module } from "@nestjs/common";
import { RewardService } from "@/modules/point/reward/reward.service";
import { AccountTypeStage } from "@/modules/point/reward/stages/account-type.stage";
import { RatingStage } from "@/modules/point/reward/stages/rating.stage";
import { BudgetStage } from "@/modules/point/reward/stages/budget.stage";
import { CalculateStage } from "@/modules/point/reward/stages/calculate.stage.interface";

@Module({
	exports: [RewardService],
	providers: [
		RewardService,
		AccountTypeStage,
		RatingStage,
		BudgetStage,
		{
			provide: "stages",
			useFactory: (...stages: CalculateStage[]) => stages,
			inject: [RatingStage, AccountTypeStage, BudgetStage],
		},
	],
})
export default class RewardModule {}
