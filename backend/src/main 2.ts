import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LOCAL_DEV_PORTS, LOCAL_DEV_SITE_URL } from './config/dev-ports';

function parseCorsOrigins(): string | string[] {
  const raw = process.env.CORS_ORIGIN ?? LOCAL_DEV_SITE_URL;
  const origins = raw.split(',').map((o) => o.trim()).filter(Boolean);
  return origins.length === 1 ? origins[0] : origins;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: parseCorsOrigins(),
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? LOCAL_DEV_PORTS.api;
  await app.listen(port);
  console.log(`Kalvettu API running on http://localhost:${port}/api`);
}
bootstrap();
