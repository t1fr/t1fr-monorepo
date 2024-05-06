import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { DisbandMember, MemberType, UpdateMemberType } from "@t1fr/backend/member-manage";
import { GuildMember, User } from "discord.js";
import type { UserCommandContext } from "necord";
import { Context, TargetUser, UserCommand } from "necord";

@Injectable()
export class MemberUserCommand {
    constructor(private readonly commandBus: CommandBus) {
    }

    @UserCommand({ name: "任命為聯隊戰隊員" })
    public async setMemberToFighter(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const member = interaction.guild?.members.resolve(user.id);
        if (!member) return interaction.reply({ content: "成員不存在" });
        const result = await this.commandBus.execute(new UpdateMemberType({ discordId: member.id, type: MemberType.SquadFighter }));
        if (result.isOk()) interaction.reply(this.createWelcomeMessage(member, "聯隊戰", result.value.message));
        else interaction.reply({ content: result.error.toString(), ephemeral: true });
    }

    @UserCommand({ name: "任命為休閒隊員" })
    public async setMemberToRelaxer(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const member = interaction.guild?.members.resolve(user.id);
        if (!member) return interaction.reply({ content: "成員不存在" });
        const result = await this.commandBus.execute(new UpdateMemberType({ discordId: member.id, type: MemberType.Relaxer }));
        if (result.isOk()) interaction.reply(this.createWelcomeMessage(member, "聯隊戰", result.value.message));
        else interaction.reply({ content: result.error.toString(), ephemeral: true });
    }

    @UserCommand({ name: "移除隊員身分" })
    public async disbandTeammate(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const member = interaction.guild?.members.resolve(user.id);
        if (!member) return interaction.reply({ content: "成員不存在" });
        const result = await this.commandBus.execute(new DisbandMember({ discordId: member.id }));
        if (result.isOk()) interaction.reply(`已解除 <@${member.id}> 的隊員身分`);
        else interaction.reply({ content: result.error.toString(), ephemeral: true });
    }

    private createWelcomeMessage(member: GuildMember, type: "聯隊戰" | "休閒", extraMessage?: string) {
        const message = [`您好，<@${member.id}>`, `您已成為 T1FR ${type}隊員`];
        if (!member.displayName.match(/^[^丨].*(丨.*)?丨.*[^丨]$/))
            message.push("請將伺服器個人暱稱用 `/nickname` 指令或手動改為：", "```", "T1FR丨您的暱稱丨您的戰雷ID", "```");

        if (extraMessage) message.push(extraMessage);

        return message.join("\n");
    }
}
