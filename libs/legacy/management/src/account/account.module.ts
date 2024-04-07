import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountModelDef } from "./account.schema";
import { ConnectionName } from "../constant";
import { AccountService } from "./account.service";
import { GithubModule } from "@t1fr/backend/backup";

@Module({
  imports: [GithubModule, MongooseModule.forFeature([AccountModelDef], ConnectionName.Management)],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {
}
