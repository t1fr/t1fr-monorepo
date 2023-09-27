import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ChannelLogger } from "@/modules/logging/channel.logger";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { CustomOrigin } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestExpressApplication } from "@nestjs/platform-express";

dayjs.extend(customParse);
dayjs.extend(utc);

const allowedOrigin: CustomOrigin = (origin: string, callback) => {
	if (origin.match(/http:\/\/localhost.*/)) return callback(null, true);
	if (origin.match(/https:\/\/squadron-manager.*/)) return callback(null, true);
	return callback(new Error("請求的來源不在白名單中"), false);
};

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true, cors: { origin: allowedOrigin } });
	app.useLogger(app.get(ChannelLogger));
	app.disable("x-powered-by");
	const configService = app.get(ConfigService);
	await app.listen(configService.get("port")!);
}

bootstrap()
