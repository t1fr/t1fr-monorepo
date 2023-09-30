import { Module } from "@nestjs/common";
import { AccountCommand } from "@/modules/bot/command/account.command";
import { ManagementModule } from "@/modules/management/management.module";
import { MemberCommand } from "@/modules/bot/command/member.command";
import { MemberUserCommand } from "@/modules/bot/command/member.user.command";
import { DiscordListener } from "@/modules/bot/listener";
import { WikiCommand } from "@/modules/bot/command/wiki.command";
import { ScheduleCommand } from "@/modules/bot/command/schedule.command";
import { WikiModule } from "@/modules/wiki/wiki.module";
import { BattleScheduleModule } from "@/modules/schedule/schedule.module";

@Module({
	imports: [ManagementModule, WikiModule, BattleScheduleModule],
	providers: [AccountCommand, MemberCommand, MemberUserCommand, DiscordListener, WikiCommand, ScheduleCommand],
})
export default class DiscordBotModule {}

