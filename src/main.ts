import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClientModule } from './module/client/client.module';
import { CoreModule } from './module/core/core.module';
import { OperatorModule } from './module/operator/operator.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // Setup Operator Swagger
  const ClientSwagger = new DocumentBuilder()
    .setTitle('Project API - Web App')
    .setDescription('API documentation for version 1 project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const ClientDocument = SwaggerModule.createDocument(app, ClientSwagger, {
    include: [ClientModule],
  });

  SwaggerModule.setup('client/docs/api', app, ClientDocument);

  // Setup Operator Swagger
  const OperatorSwagger = new DocumentBuilder()
    .setTitle('Project API - Web App')
    .setDescription('API documentation for version 1 project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const OperatorDocument = SwaggerModule.createDocument(app, OperatorSwagger, {
    include: [OperatorModule],
  });

  SwaggerModule.setup('operator/docs/api', app, OperatorDocument);

  // Setup Core Swagger
  const CoreSwagger = new DocumentBuilder()
    .setTitle('Project API - System')
    .setDescription('API documentation for version 1 project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const CoreDocument = SwaggerModule.createDocument(app, CoreSwagger, {
    include: [CoreModule],
  });

  SwaggerModule.setup('core/docs/api', app, CoreDocument);

  // Setup auto-validations
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT || 3000, function () {
    console.log('Express server listening on port %d in %s mode');
  });
}
bootstrap();
