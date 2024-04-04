import { Module } from "@nestjs/common";
import { ChannelLogger } from "./channel.logger";

@Module({
	providers: [ChannelLogger],
	exports: [ChannelLogger],
})
export default class LoggerModule {
}
