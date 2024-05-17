import { Inject, Injectable, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { UpdateMemberInfo } from "@t1fr/backend/member-manage";
import { Context, type ContextOf, On, Once } from "necord";

@Injectable()
export class DiscordListener {
    private readonly logger = new Logger(DiscordListener.name);

    @Inject()
    private readonly commandBus!: CommandBus;

    @Once("ready")
    public onReady(@Context() [client]: ContextOf<"ready">) {
        if (client.user && client.application) this.logger.log(`Ready! Logged in as ${client.user.tag}`);
    }

    @On("debug")
    onDebug(@Context() [message]: ContextOf<"debug">) {
        if (process.env["NODE_ENV"] !== "production") this.logger.debug(message);
    }

    @On("guildMemberNicknameUpdate")
    async onGuildMemberNicknameUpdate(@Context() [member, , newNickname]: ContextOf<"guildMemberNicknameUpdate">) {
        await this.commandBus.execute(new UpdateMemberInfo({ discordId: member.id, nickname: newNickname }));
    }

    @On("guildMemberAvatarUpdate")
    async onGuildMemberAvatarUpdate(@Context() [member, , newAvatarUrl]: ContextOf<"guildMemberAvatarUpdate">) {
        await this.commandBus.execute(new UpdateMemberInfo({ discordId: member.id, avatarUrl: newAvatarUrl }));
    }

    @On("voiceChannelJoin")
    async onVoiceChannelJoin(@Context() [member, channel]: ContextOf<"voiceChannelJoin">) {
        if (member.id !== "963984439027855460") return;
        const ouo = channel.members.find(value => value.id === "287556741808259075");
        await ouo?.voice.disconnect("緊急避難");
    }


}
