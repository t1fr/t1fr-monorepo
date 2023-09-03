import { Module } from "@nestjs/common";
import { RewardService } from "@/modules/management/point/reward.service";
import { CalculateStage, stages } from "@/modules/management/point/stages/stage";
import { PointRepo } from "@/modules/management/point/point.repo";
import { MongooseModule } from "@nestjs/mongoose";
import { PointEventModelDef } from "@/modules/management/point/point.schema";

@Module({
	exports: [RewardService],
	imports: [MongooseModule.forFeature([PointEventModelDef])],
	providers: [RewardService, PointRepo, ...stages, { provide: "stages", useFactory: (...stages: CalculateStage[]) => stages, inject: stages }],
})
export default class PointModule {}
