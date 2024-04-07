import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { CustomOrigin } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import * as process from "process";

dayjs.extend(customParse);
dayjs.extend(utc);

const allowedOrigin: CustomOrigin = (origin: string, callback) => {
  if (!origin) return callback(null, false);
  if (origin.match(/^http:\/\/localhost.*/)) return callback(null, true);
  if (origin.match(/^https:\/\/t1fr\.club$/)) return callback(null, true);
  return callback(null, false);
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true, cors: { origin: allowedOrigin, credentials: true } });
  app.disable("x-powered-by");
  app.use(cookieParser());
  app.setGlobalPrefix("api");

  if (process.env["NODE_ENV"] !== "production") {
    const swaggerConfig = new DocumentBuilder().setTitle("聯隊管理系統 API").build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);
  }
  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT") ?? 3000);
}

bootstrap();
