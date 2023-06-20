import { ConsoleLogger, Injectable } from "@nestjs/common";
import { Client } from "discord.js";

@Injectable()
export class ChannelLogger extends ConsoleLogger {
	private readonly logChannelId = "1120693732824588328";

	constructor(private readonly client: Client) {
		super();
	}

	log(message: any, context?: string) {
		super.log(message, context);
		const channel = this.client.channels.cache.find((channel) => channel.id === this.logChannelId);
		if (channel && channel.isTextBased()) {
			channel.send(["```", message, "```"].join("\n"));
		}
	}
}
