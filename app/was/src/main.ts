import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppFilter } from './app.filter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { urlencoded, json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { LoggerMiddleware } from './log/logger.middleware';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.use(
    '/docs', // swagger 인증 설정 SwaggerModule.setup보다 먼저 선언해야함
    basicAuth({
      challenge: true,
      users: {
        // [username]: [password]
        admin: 'Admin123@',
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('One For All API Docs')
    .setDescription('<p>One For All API Docs</p><p>API 문서입니다.</p>')
    .setExternalDoc('JSON-SCHEMA', '/docs/json')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/docs/json',
  });

  // class validator dto 전역설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터가 없을때 초기값으로 변환
      transformOptions: {
        enableImplicitConversion: true, // 요청데이터 타입변경
      },
      whitelist: true, // 요청 데이터에 없는 속성은 제거
      forbidNonWhitelisted: true, // 요청 데이터에 없는 속성이 있을시 에러
    }),
  );

  // '/api' 경로로 들어오는 요청에 대한 전역 접두사 설정
  // app.setGlobalPrefix('api');
  app.useGlobalFilters(new AppFilter(httpAdapter), new HttpExceptionFilter());

  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));
  app.use(cookieParser());

  function checkOrigin(origin: string | undefined): boolean {
    if (!origin) return true; // 서버에서 시작하는 요청은 허용
    const whitelist = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:8081',
      'https://twosday.live',
    ];

    return whitelist.some(
      (allowedOrigin) =>
        origin.startsWith(allowedOrigin) || origin.endsWith('.twosday.live'),
    );
  }

  // cors 허용
  app.enableCors({
    origin: (origin, callback) => {
      if (checkOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 디버깅용
  app.use(new LoggerMiddleware().use);

  // app.enableShutdownHooks();

  const port = 8080;
  await app.listen(port, async () => {
    Logger.log(
      `🚀 one_for_all 서버가 실행되었습니다. 🚀 포트 : ${port}, ENV : ${process.env.NODE_ENV}`,
    );
  });
}

bootstrap();
