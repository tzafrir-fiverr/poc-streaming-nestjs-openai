import { Module } from '@nestjs/common';
import { OpenAiModule } from './openai/openai.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../src'),
      serveRoot: '/',
      exclude: ['/openai*'],
    }),
    OpenAiModule,
  ],
})
export class AppModule {}
