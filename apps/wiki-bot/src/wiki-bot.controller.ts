import { Controller, Get } from '@nestjs/common';
import { WikiBotService } from './wiki-bot.service';

@Controller()
export class WikiBotController {
  constructor(private readonly wikiBotService: WikiBotService) {}

  @Get()
  getHello(): string {
    return this.wikiBotService.getHello();
  }
}
