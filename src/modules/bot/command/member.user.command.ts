import {Context, TargetUser, UserCommand, UserCommandContext} from "necord";
import {User} from "discord.js";
import {Injectable} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";
import {MemberChangeCommand} from "@/modules/management/member/member.command";
import {MemberChangeAction} from "@/modules/management/member/member.event";

@Injectable()
export class MemberUserCommand {
    constructor(private readonly commandBus: CommandBus) {
    }

    @UserCommand({name: "任命為聯隊戰隊員"})
    public async setMemberToFighter(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const member = interaction.guild?.members.resolve(user.id);
        if (!member) return interaction.reply({content: "成員不存在"});
        const content = await this.commandBus.execute(new MemberChangeCommand(member, MemberChangeAction.AS_FIGHTER));
        interaction.reply({content});
    }

    @UserCommand({name: "任命為休閒隊員"})
    public async setMemberToRelaxer(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const member = interaction.guild?.members.resolve(user.id);
        if (!member) return interaction.reply({content: "成員不存在"});
        const content = await this.commandBus.execute(new MemberChangeCommand(member, MemberChangeAction.AS_RELAXER));
        interaction.reply({content});
    }

    @UserCommand({name: "移除隊員身分"})
    public async disbandTeammate(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const member = interaction.guild?.members.resolve(user.id);
        if (!member) return interaction.reply({content: "成員不存在"});
        const content = await this.commandBus.execute(new MemberChangeCommand(member, MemberChangeAction.DISBAND));
        interaction.reply({content});
    }
}
