import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? 'config/.env.production'
    : process.env.NODE_ENV === 'stagging'
      ? 'config/.env.stagging'
      : 'config/.env.development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
