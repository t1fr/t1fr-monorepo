import { NestFactory } from '@nestjs/core';
import { WikiBotModule } from './wiki-bot.module';

async function bootstrap() {
  const app = await NestFactory.create(WikiBotModule);
  await app.listen(3000);
}
bootstrap();
