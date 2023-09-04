import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ChannelLogger } from "@/modules/logging/channel.logger";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParse);
dayjs.extend(utc);

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(app.get(ChannelLogger));
	const configService = app.get(ConfigService);
	await app.listen(configService.get("port")!);
}

bootstrap();
