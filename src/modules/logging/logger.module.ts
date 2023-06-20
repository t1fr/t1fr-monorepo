import { Module } from "@nestjs/common";
import { ChannelLogger } from "@/modules/logging/channel.logger";

@Module({
	providers: [ChannelLogger],
	exports: [ChannelLogger],
})
export default class LoggerModule {}
