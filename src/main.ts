import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const config = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend Api')
    .setVersion(process.env.npm_package_version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);
  const port = config.get('serverOptions.port');
  await app.listen(port, () => {
    logger.verbose(`Server is listening port: ${port}`);
    logger.verbose(`Server is running in ${config.get('mode')} mode`);
  });
}
bootstrap().catch((reason) => {
  throw reason;
});
