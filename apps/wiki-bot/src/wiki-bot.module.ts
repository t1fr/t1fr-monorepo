import { Module } from '@nestjs/common';
import { WikiBotController } from './wiki-bot.controller';
import { WikiBotService } from './wiki-bot.service';

@Module({
  imports: [],
  controllers: [WikiBotController],
  providers: [WikiBotService],
})
export class WikiBotModule {}
