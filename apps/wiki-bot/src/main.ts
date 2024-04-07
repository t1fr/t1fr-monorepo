import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./AppModule";

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
  Logger.log(`🚀 Discord Bot is running`);
}

bootstrap();
