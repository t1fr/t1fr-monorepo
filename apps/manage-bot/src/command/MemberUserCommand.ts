import { Inject, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { UpdateMemberInfo } from "@t1fr/backend/member-manage";
import type { User } from "discord.js";
import { Context, TargetUser, UserCommand, type UserCommandContext } from "necord";

@Injectable()
export class MemberUserCommand {

    @Inject()
    private readonly commandBus!: CommandBus

    @UserCommand({ name: "設為贊助者" })
    public async setSponsor(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const result = await this.commandBus.execute(new UpdateMemberInfo({ discordId: user.id, isSponsor: true }));
        if (result.isOk()) interaction.reply(`已設定 <@${user.id}> 為贊助者`);
        else interaction.reply({ content: result.error.toString(), ephemeral: true });
    }

    @UserCommand({ name: "取消贊助者" })
    public async unsetSponsor(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
        const result = await this.commandBus.execute(new UpdateMemberInfo({ discordId: user.id, isSponsor: true }));
        if (result.isOk()) interaction.reply(`已取消 <@${user.id}> 贊助者身分`);
        else interaction.reply({ content: result.error.toString(), ephemeral: true });
    }

    // @UserCommand({ name: "任命為聯隊戰隊員" })
    // public async setMemberToFighter(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
    //     const member = interaction.guild?.members.resolve(user.id);
    //     if (!member) return interaction.reply({ content: "成員不存在" });
    //     const result = await this.commandBus.execute(new UpdateMemberType({ discordId: member.id, type: MemberType.SquadFighter }));
    //     if (result.isOk()) interaction.reply(this.createWelcomeMessage(member, "聯隊戰", result.value.message));
    //     else interaction.reply({ content: result.error.toString(), ephemeral: true });
    // }

    // @UserCommand({ name: "任命為休閒隊員" })
    // public async setMemberToRelaxer(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
    //     const member = interaction.guild?.members.resolve(user.id);
    //     if (!member) return interaction.reply({ content: "成員不存在" });
    //     const result = await this.commandBus.execute(new UpdateMemberType({ discordId: member.id, type: MemberType.Relaxer }));
    //     if (result.isOk()) interaction.reply(this.createWelcomeMessage(member, "聯隊戰", result.value.message));
    //     else interaction.reply({ content: result.error.toString(), ephemeral: true });
    // }

    // @UserCommand({ name: "移除隊員身分" })
    // public async disbandTeammate(@Context() [interaction]: UserCommandContext, @TargetUser() user: User) {
    //     const member = interaction.guild?.members.resolve(user.id);
    //     if (!member) return interaction.reply({ content: "成員不存在" });
    //     const result = await this.commandBus.execute(new DisbandMember({ discordId: member.id }));
    //     if (result.isOk()) interaction.reply(`已解除 <@${member.id}> 的隊員身分`);
    //     else interaction.reply({ content: result.error.toString(), ephemeral: true });
    // }

    // private createWelcomeMessage(member: GuildMember, type: "聯隊戰" | "休閒", extraMessage?: string) {
    //     const message = [`您好，<@${member.id}>`, `您已成為 T1FR ${type}隊員`];
    //     if (!member.displayName.match(/^[^丨].*(丨.*)?丨.*[^丨]$/))
    //         message.push("請將伺服器個人暱稱用 `/nickname` 指令或手動改為：", "```", "T1FR丨您的暱稱丨您的戰雷ID", "```");

    //     if (extraMessage) message.push(extraMessage);

    //     return message.join("\n");
    // }


}
