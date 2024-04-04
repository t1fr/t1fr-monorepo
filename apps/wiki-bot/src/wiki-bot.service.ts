import { Injectable } from '@nestjs/common';

@Injectable()
export class WikiBotService {
  getHello(): string {
    return 'Hello World!';
  }
}
