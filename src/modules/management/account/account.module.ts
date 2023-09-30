import { Module } from "@nestjs/common";
import { AccountService } from "@/modules/management/account/account.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConnectionName } from "@/constant";
import { AccountModelDef } from "@/modules/management/account/account.schema";
import { AccountController } from "@/modules/management/account/account.controller";

@Module({
	imports: [MongooseModule.forFeature([AccountModelDef], ConnectionName.Management)],
	providers: [AccountService],
	exports: [AccountService],
	controllers: [AccountController],
})
export class AccountModule {}