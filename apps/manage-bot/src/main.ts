import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import "tslib";
import { AppModule } from "./AppModule";


async function createApp(standaloneApp: boolean) {
    const app = await (standaloneApp ? NestFactory.createApplicationContext(AppModule) : NestFactory.create<NestExpressApplication>(AppModule));
    return app;
}

async function bootstrap() {
    const app = await createApp(true)
    app.init();
    Logger.log(`🚀 聯隊管理 BOT 執行中`);
}

if (__BUILD__) bootstrap();


export const appServer = createApp(false)