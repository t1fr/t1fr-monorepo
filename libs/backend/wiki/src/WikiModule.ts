import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScrpeDatamineHandler } from "./application/command/ScrpeDatamineHandler";
import { FindByIdHandler } from "./application/query/FindByIdHandler";
import { ListEnumableFieldHandler } from "./application/query/ListEnumableFieldHandler";
import { SearchHandler } from "./application/query/SearchHandler";
import { AxiosVehicleApiRepoProvide, MongoVehicleRepoProvider, VehicleModelDef } from "./infrastructure";

@Module({
  imports: [MongooseModule.forFeature([VehicleModelDef])],
  providers: [ScrpeDatamineHandler, FindByIdHandler, SearchHandler, ListEnumableFieldHandler, MongoVehicleRepoProvider, AxiosVehicleApiRepoProvide],
  exports: [],
})
export class WikiModule {
}
