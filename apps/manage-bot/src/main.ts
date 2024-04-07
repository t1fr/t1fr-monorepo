import { NestFactory } from "@nestjs/core";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { AppModule } from "./app.module";

dayjs.extend(customParse);
dayjs.extend(utc);


async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
}

bootstrap();
