import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

export async function bootstrap(port?: number): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'development' ? ['log', 'error', 'warn', 'debug'] : ['error', 'warn'],
  });

  // Enable CORS for Electron renderer
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'app://'],
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const listenPort = port || parseInt(process.env.PORT || '3000', 10);
  await app.listen(listenPort);

  console.log(`NestJS server running on http://localhost:${listenPort}`);

  return app;
}

// Only start server if not imported by Electron
if (require.main === module) {
  bootstrap();
}
