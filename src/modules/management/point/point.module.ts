import { stages } from "@/modules/management/point/stages/stage";
import { Module } from "@nestjs/common";
import { PointService } from "@/modules/management/point/point.service";
import { RewardService } from "@/modules/management/point/reward.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConnectionName } from "@/constant";
import { PointEventModelDef } from "@/modules/management/point/point.schema";
import { GithubModule } from "@/modules/github/github.module";

@Module({
	imports: [GithubModule, MongooseModule.forFeature([PointEventModelDef], ConnectionName.Management)],
	providers: [RewardService, PointService, ...stages, { provide: "stages", useValue: stages }],
	exports: [PointService],
})
export default class PointModule {}