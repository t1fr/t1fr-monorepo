import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ChannelLogger } from "@/modules/logging/channel.logger";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { CustomOrigin } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { INestApplication } from "@nestjs/common";
import { SpelunkerModule } from "nestjs-spelunker";
import { writeFileSync } from "fs";

dayjs.extend(customParse);
dayjs.extend(utc);

const allowedOrigin: CustomOrigin = (origin: string, callback) => {
	if (!origin) return callback(null, false);
	if (origin.match(/http:\/\/localhost.*/)) return callback(null, true);
	if (origin.match(/http:\/\/t1fr\.club\/.*/)) return callback(null, true);
	return callback(new Error(`請求的來源: ${origin} 不在白名單中`), false);
};

const extraModules = [
	"ConfigHostModule",
	"LoggerModule",
	"MongooseCoreModule",
	"MongooseModule",
	"DiscoveryModule",
	"HttpModule",
	"JwtModule",
	"NecordModule",
	"ScheduleModule",
	"ConfigModule",
];

function drawDepGraph(app: INestApplication) {
	const tree = SpelunkerModule.explore(app);
	const root = SpelunkerModule.graph(tree);
	const edges = SpelunkerModule.findGraphEdges(root);
	const mermaidEdges = edges
		.filter(
			// I'm just filtering some extra Modules out
			({ from, to }) => !extraModules.includes(from.module.name) && !extraModules.includes(to.module.name),
		)
		.map(({ from, to }) => `${from.module.name}-->${to.module.name}`);

	writeFileSync("graph.md", ["```mermaid", "graph TD", `\t${mermaidEdges.join("\n\t")}`, "```"].join("\n"));
}

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
	app.useLogger(app.get(ChannelLogger));
	app.disable("x-powered-by");
	app.use(cookieParser());
	app.setGlobalPrefix("api");
	const swaggerConfig = new DocumentBuilder().setTitle("聯隊管理系統 API").build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("api", app, document);
	const configService = app.get(ConfigService);
	drawDepGraph(app);
	await app.listen(configService.get("PORT")!);
}

bootstrap()
