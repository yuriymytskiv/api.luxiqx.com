import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // App Initialization
  const app = await NestFactory.create(AppModule);
  // App Port
  const port = process.env.APP_PORT ?? 9000;
  // Global Pipes
  app.useGlobalPipes(new ValidationPipe());
  // Global Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Luxiqx API's")
    .setDescription("Luxiqx API's for the Luxiqx site. Reference only.")
    .setVersion('1.0')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // Starting App
  await app.listen(port, () => {
    console.log('Luxiqx apis listening on port: ' + port);
  });
}
bootstrap();
