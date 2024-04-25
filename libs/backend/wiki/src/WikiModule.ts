import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScrapeDatamineHandler } from "./application/command/ScrapeDatamineHandler";
import { FindByIdHandler } from "./application/query/FindByIdHandler";
import { ListEnumableFieldHandler } from "./application/query/ListEnumableFieldHandler";
import { SearchHandler } from "./application/query/SearchHandler";
import { AxiosVehicleApiRepoProvide, MongoVehicleRepoProvider, VehicleModelDef } from "./infrastructure";

@Module({
  imports: [MongooseModule.forFeature([VehicleModelDef])],
  providers: [ScrapeDatamineHandler, FindByIdHandler, SearchHandler, ListEnumableFieldHandler, MongoVehicleRepoProvider, AxiosVehicleApiRepoProvide],
  exports: [],
})
export class WikiModule {
}
