import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Documentação Cultiva - API')
    .setDescription(
      'Bem-vindo à documentação da Cultiva, o seu destino online para produtos sustentáveis que promovem um estilo de vida ecologicamente consciente. Navegue pela nossa extensa seleção de itens que vão desde moda até produtos para o lar, todos cuidadosamente escolhidos para apoiar práticas sustentáveis. No Cultiva, acreditamos que cada compra pode fazer a diferença, e é por isso que oferecemos uma variedade de opções ecológicas que não comprometem o meio ambiente. Junte-se a nós na jornada de cultivar um mundo mais verde e estiloso.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token (to get a token, you must login in the /login route)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
