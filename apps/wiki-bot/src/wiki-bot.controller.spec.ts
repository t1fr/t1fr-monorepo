import { Test, TestingModule } from '@nestjs/testing';
import { WikiBotController } from './wiki-bot.controller';
import { WikiBotService } from './wiki-bot.service';

describe('WikiBotController', () => {
  let wikiBotController: WikiBotController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WikiBotController],
      providers: [WikiBotService],
    }).compile();

    wikiBotController = app.get<WikiBotController>(WikiBotController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(wikiBotController.getHello()).toBe('Hello World!');
    });
  });
});
