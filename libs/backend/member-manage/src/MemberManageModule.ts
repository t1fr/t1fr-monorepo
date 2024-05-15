import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { union } from "lodash-es";
import { MemberManageCommandHandler, MemberManageQueryHandlers } from "./application";
import {
    AccountModelDef,
    BackupModelDef,
    MemberManageInfraProvider,
    MemberManageMongooseConnection,
    MemberModelDef,
    MongoMemberQueryRepoProvider,
    PointLogModelDef,
} from "./infrastructure";

@Module({
    imports: [MongooseModule.forFeature([PointLogModelDef, MemberModelDef, AccountModelDef, BackupModelDef], MemberManageMongooseConnection)],
    providers: union(MemberManageCommandHandler, MemberManageQueryHandlers, MemberManageInfraProvider),
    exports: [MongoMemberQueryRepoProvider],
})
export class MemberManageModule { }
