import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppFilter } from './app.filter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { urlencoded, json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  const options = new DocumentBuilder()
    .setTitle('One For All API Docs')
    .setDescription('One For All API Docs')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

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

  // cors 허용
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://twosday.live',
      'https://*.twosday.live',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // app.enableShutdownHooks();

  const port = 8080;
  await app.listen(port, async () => {
    Logger.log(
      `🚀 one_for_all 서버가 실행되었습니다. 🚀 포트 : ${port}, ENV : ${process.env.NODE_ENV}`,
    );
  });
}
bootstrap();
