import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigEnum } from './config/config.enum';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { UserRolesEnum } from './users/enums/user-roles.enum';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const logger = new Logger('bootstrap');
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend Api')
    .setVersion('0.0.1');
  Object.keys(UserRolesEnum).forEach((role) => {
    swaggerConfig.addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      role,
    );
  });
  const document = SwaggerModule.createDocument(app, swaggerConfig.build());
  SwaggerModule.setup('api-docs', app, document);
  const port = config.get(ConfigEnum.PORT);
  await app.listen(port, () => {
    logger.verbose(`Server is listening port: ${port}`);
    logger.verbose(`Server is running in mode: ${config.get('MODE')}`);
  });
}

bootstrap().catch((reason) => {
  throw reason;
});
