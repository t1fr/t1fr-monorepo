import { Module } from "@nestjs/common";
import { AccountCommand } from "./command/account.command";
import { MemberCommand } from "./command/member.command";
import { MemberUserCommand } from "./command/member.user.command";
import { ManagementModule } from "../management";
import { WikiModule } from "../wiki";
import { BattleScheduleModule } from "../schedule/schedule.module";
import { DiscordListener } from "./listener";
import { WikiCommand } from "./command/wiki.command";
import { ScheduleCommand } from "./command/schedule.command";
import { PointCommand } from "./command/point.command";

@Module({
	imports: [ManagementModule, WikiModule, BattleScheduleModule],
	providers: [AccountCommand, MemberCommand, MemberUserCommand, DiscordListener, WikiCommand, ScheduleCommand, PointCommand],
})
export class DiscordBotModule {}

