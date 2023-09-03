import { ConsoleLogger, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Client, TextBasedChannel } from "discord.js";

@Injectable()
export class ChannelLogger extends ConsoleLogger implements OnApplicationBootstrap {
	private readonly logChannelId = "1120693732824588328";
	private logChannel: TextBasedChannel;

	constructor(private readonly client: Client) {
		super();
	}

	log(message: any, context?: string) {
		super.log(message, context);
		this.logChannel.send([":pencil:", "`", message, "`"].join(""));
	}

	error(message: any, stack?: string, context?: string) {
		super.error(message, stack, context);
		this.logChannel.send([":exclamation:", "`", message, "`"].join(""));
	}

	async onApplicationBootstrap() {
		if (this.client.application) {
			this.client.application.commands.set([]);
		}

		const channel = await this.client.channels.fetch(this.logChannelId);
		if (channel && channel.isTextBased()) {
			this.logChannel = channel;
		} else {
			this.error("無法找到日誌頻道");
		}
	}
}
