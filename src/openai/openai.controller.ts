import { Controller, Query, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OpenAiService } from './openai.service';

@Controller('openai')
export class OpenAiController {
  constructor(private readonly openai: OpenAiService) {}

  @Sse('chat')
  chat(@Query('prompt') prompt: string): Observable<MessageEvent> {
    const messages = [
      { role: 'user' as const, content: prompt || '' },
    ];
    return this.openai.streamChat(messages);
  }
}
