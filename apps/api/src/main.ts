import { INestApplication, Logger } from "@nestjs/common";
import { CustomOrigin } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import process from "process";
import { AppModule } from "./AppModule";
import "tslib";

console.log(process.env["NODE_ENV"]);
const allowedOrigin: CustomOrigin = (origin: string, callback) => {
    if (!origin) return callback(null, false);
    const url = new URL(origin);
    if (url.protocol === "http:" && url.hostname === "localhost") return callback(null, true);
    if (url.protocol === "https:" && url.hostname === "t1fr.club") return callback(null, true);
    return callback(null, false);
};

function configSwagger(app: INestApplication) {
    const swaggerConfig = new DocumentBuilder().setTitle("聯隊管理系統 API").build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: { origin: allowedOrigin, credentials: true } });
    app.disable("x-powered-by");
    app.use(cookieParser());
    app.setGlobalPrefix("api");

    if (process.env["NODE_ENV"] !== "production") configSwagger(app);

    const configService = app.get(ConfigService);
    const port = configService.get("app.port", 3000);
    await app.listen(port);

    Logger.log(`API 伺服器啟動中，監聽 port ${port}`);
}

bootstrap();
