import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import agendaJobs from './notifications/agendaJobs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  agendaJobs();
  await app.listen(5001);
}
bootstrap();
