import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VehicleModelDef } from "@/modules/wiki/vehicle.schema";
import { ConnectionName } from "@/constant";
import { WikiService } from "@/modules/wiki/wiki.service";

@Module({
	imports: [MongooseModule.forFeature([VehicleModelDef], ConnectionName.Common)],
	providers: [WikiService],
	exports: [WikiService],
})
export class WikiModule {}