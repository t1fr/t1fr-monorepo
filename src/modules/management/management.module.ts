import { Module } from "@nestjs/common";
import { DiscordListenerService } from "./member/listener.service";
import AccountModule from "@/modules/management/account/account.module";
import MemberModule from "@/modules/management/member/member.module";

@Module({
	imports: [AccountModule, MemberModule],
	providers: [DiscordListenerService],
})
export class ManagementModule {}
