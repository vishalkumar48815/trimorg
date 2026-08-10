import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());

  const allowedOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  const configuredOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173';

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ): void => {
      if (!origin || origin === configuredOrigin || allowedOriginPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(Number(process.env.PORT ?? 3001), '127.0.0.1');
}
void bootstrap();
