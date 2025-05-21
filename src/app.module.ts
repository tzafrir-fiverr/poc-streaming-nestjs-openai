import { Module } from '@nestjs/common';
import { OpenAiModule } from './openai/openai.module';

@Module({
  imports: [OpenAiModule],
})
export class AppModule {}
