import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // NOTE: Nest's Mongoose doesn't like localhost, it expects an IPv6 address
    MongooseModule.forRoot(process.env.DATABASE_URL),
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/abode-calendar-shr'),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
