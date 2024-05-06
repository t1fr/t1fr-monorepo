import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

async function createApp(standaloneApp: boolean) {
    const app = await (standaloneApp ? NestFactory.createApplicationContext(AppModule) : NestFactory.create(AppModule));
    return app;

}

async function bootstrap() {
    const app = await createApp(true)
    app.init();
    Logger.log(`🚀 WIKI BOT 執行中`);
}


export const appServer = __BUILD__ ? bootstrap() : createApp(false)