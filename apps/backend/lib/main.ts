// src/lib/main.ts

import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
// import 'fastify-swagger' // 불필요하면 제거 고려
import { ValidationPipe } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { FastifyInstance } from 'fastify'
import multipart from '@fastify/multipart';
import { HttpExceptionFilter } from './common/filter/http-exception.filter'

// 기본값을 '0.0.0.0'과 '3000'으로 변경하여 컨테이너 외부 접근 가능하도록 설정
export default async function bootstrap(hostname: string = '0.0.0.0', port: string = '3000') { // <-- 기본값 변경
  const fastifyAdapter = new FastifyAdapter();
  const fastify: FastifyInstance = fastifyAdapter.getInstance();
  await fastify.register(multipart);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }))
  app.setGlobalPrefix('')
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('FOCAS API')
    .setDescription('FOCAS API Docs')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'access-token'
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/docs', app, document)

  // app.listen 호출
  await app.listen(Number(port), hostname); // 수정된 기본값 사용 또는 환경변수/인자값 사용
  console.log(`Application is running on: ${hostname}:${port}`); // 디버깅용 로깅
  // await app.startAllMicroservices(); // 마이크로서비스 사용 시 주석 해제
}


bootstrap()
