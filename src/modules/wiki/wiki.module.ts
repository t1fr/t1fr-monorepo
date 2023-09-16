import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VehicleModelDef } from "@/modules/wiki/vehicle.schema";
import { ConnectionName } from "@/constant";
import { WikiRepo } from "@/modules/wiki/wiki.repo";
import { WikiCommand } from "@/modules/wiki/wiki.command";
import { WikiAutocompleteInterceptor } from '@/modules/wiki/wiki.autocomplete'

@Module({
	imports: [MongooseModule.forFeature([VehicleModelDef], ConnectionName.Common)],
	providers: [WikiRepo, WikiCommand, WikiAutocompleteInterceptor],
})
export class WikiModule {}