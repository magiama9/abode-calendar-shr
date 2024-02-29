import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schema/event.schema';
// import { AuthenticationMiddleware } from '../shared/authentication.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

// export class EventsModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
//     consumer
//       .apply(AuthenticationMiddleware)
//       .forRoutes(
//         { method: RequestMethod.GET, path: '/events' },
//         { method: RequestMethod.POST, path: '/events/' },
//         { method: RequestMethod.PATCH, path: '/events' },
//         { method: RequestMethod.DELETE, path: '/events/' },
//       );
//   }
// }
