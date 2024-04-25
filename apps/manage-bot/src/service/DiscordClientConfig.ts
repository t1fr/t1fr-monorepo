import { Configuration } from "@t1fr/backend/configs";

export class DiscordClientConfig {
    @Configuration("bot.channels.recruitment")
    private readonly recruitmentChannelId!: string;

    @Configuration("bot.guilds.t1fr")
    private readonly t1frGuildId!: string;

    @Configuration("bot.roles.officer")
    private readonly officerRoleId!: string;

    @Configuration("bot.roles.sqb")
    private readonly sqbRoleId!: string;

    @Configuration("bot.roles.relax")
    private readonly relaxRoleId!: string;


    get roles() {
        return {
            officer: this.officerRoleId,
            fighter: this.sqbRoleId,
            relaxer: this.relaxRoleId,
        };
    }
}