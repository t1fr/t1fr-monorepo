import { NestFactory } from "@nestjs/core";
import { WikiBotModule } from "./WikiBotModule";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(WikiBotModule);
}

bootstrap();
