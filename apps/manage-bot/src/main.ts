import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    app.init();
    Logger.log(`🚀 Discord Bot is running`);
}

bootstrap();
