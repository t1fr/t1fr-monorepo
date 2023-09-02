import { Module } from "@nestjs/common";
import { RewardService } from "@/modules/management/point/reward.service";
import { AccountTypeStage } from "@/modules/management/point/stages/account-type.stage";
import { RatingStage } from "@/modules/management/point/stages/rating.stage";
import { BudgetStage } from "@/modules/management/point/stages/budget.stage";
import { CalculateStage } from "@/modules/management/point/stages/calculate.stage.interface";

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
export default class PointModule {}
