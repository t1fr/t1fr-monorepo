import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountModelDef } from "./account.schema";
import { ConnectionName } from "../../../constant";
import { AccountService } from "./account.service";
import { GithubModule } from "../../github/github.module";
import { AccountController } from "./account.controller";

@Module({
	imports: [GithubModule, MongooseModule.forFeature([AccountModelDef], ConnectionName.Management)],
	providers: [AccountService],
	exports: [AccountService],
	controllers: [AccountController],
})
export class AccountModule {}