import { Module } from "@nestjs/common";
import { DiscordListenerService } from "./member/bot/listener.service";
import AccountModule from "@/modules/squadron/account/account.module";
import MemberModule from "@/modules/squadron/member/member.module";

@Module({
	imports: [AccountModule, MemberModule],
	providers: [DiscordListenerService],
})
export class SquadronModule {}
