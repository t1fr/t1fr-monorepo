import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ChannelLogger } from "@/modules/logging/channel.logger";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";

dayjs.extend(customParse);

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(app.get(ChannelLogger));
	const configService = app.get(ConfigService);
	await app.listen(configService.get("port")!);
}

bootstrap();
