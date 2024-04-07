import { Module } from "@nestjs/common";
import { ScrpeDatamineHandler } from "./application/command/ScrpeDatamineHandler";
import { MongoVehicleRepoProvider, AxiosVehicleApiRepoProvide, VehicleModelDef } from "./infrastructure";
import { MongooseModule } from "@nestjs/mongoose";
import { SearchHandler } from "./application/query/SearchHandler";
import { FindByIdHandler } from "./application/query/FindByIdHandler";

@Module({
    imports: [MongooseModule.forFeature([VehicleModelDef])],
    providers: [ScrpeDatamineHandler, FindByIdHandler, SearchHandler, MongoVehicleRepoProvider, AxiosVehicleApiRepoProvide],
    exports: [],
})
export class WikiModule {
}
