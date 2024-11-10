import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from '@common/filters';
import { TransformInterceptor } from '@common/interceptors';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('frontendUrl');
  const localUrl = configService.get<string>('localUrl');

  app.use(cookieParser());
  app.enableCors({
    origin: localUrl ? [frontendUrl, localUrl] : [frontendUrl],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('port');

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('후루룩(Hululug)')
    .setDescription('나만의 라면 레시피 공유 플랫폼')
    .setVersion('1.0')
    .addCookieAuth('token')
    .addServer('http://localhost:3000', 'local')
    .addServer('https://hululug-server-dev.up.railway.app', 'develop')
    .addServer('https://hululug-server-prod.up.railway.app', 'production')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
      },
    },
  });

  await app.listen(port);
}
bootstrap();
