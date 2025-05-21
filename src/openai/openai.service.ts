import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class OpenAiService {
  private apiKey = process.env.OPENAI_API_KEY || '';

  streamChat(messages: ChatMessage[]): Observable<MessageEvent> {
    const body = {
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    };

    return new Observable<MessageEvent>((observer) => {
      const abort = new AbortController();
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: abort.signal,
      })
        .then(async (res) => {
          const reader = res.body?.getReader();
          if (!reader) {
            observer.error(new Error('No response body'));
            return;
          }
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter((l) => l.trim().length > 0);
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.replace(/^data: /, '').trim();
                if (data === '[DONE]') {
                  observer.complete();
                } else {
                  observer.next({ data });
                }
              }
            }
          }
          observer.complete();
        })
        .catch((err) => observer.error(err));

      return () => abort.abort();
    });
  }
}
