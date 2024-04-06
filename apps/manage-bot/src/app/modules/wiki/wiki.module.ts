import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VehicleModelDef } from "./vehicle.schema";
import { ConnectionName } from "../../constant";
import { WikiService } from "./wiki.service";

@Module({
	imports: [MongooseModule.forFeature([VehicleModelDef], ConnectionName.Common)],
	providers: [WikiService],
	exports: [WikiService],
})
export class WikiModule {}