import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoginDto } from './modules/auth/dtos/login.dto';
import { RegisterDto } from './modules/auth/dtos/register.dto';
import { RegisterOnboardingDto } from './modules/onboarding/dtos/register.dto';
import { RegisterProductDto } from './modules/products/dtos/register.dto';
import { UpdateProductDto } from './modules/products/dtos/update.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port')!;

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Onboarding Gatekeeper API')
    .setDescription(
      `API documentation for Onboarding Gatekeeper service

**Important Security Notice:**
This API uses AES encryption for sensitive data. Endpoints marked with @UseInterceptors(CryptoInterceptor) require encrypted request bodies.

**Encryption Process:**
1. Create the DTO object with the required fields
2. Convert the DTO to JSON string
3. Encrypt the JSON string using AES encryption
4. Send the encrypted data in the request body as: { "encryptedData": "encrypted_string_here" }

**Decryption Process:**
The API will automatically decrypt the request and return responses in the same encrypted format.

**Example Request Flow:**
Raw DTO: { "username": "john", "password": "pass123" }
Encrypted: { "encryptedData": "U2FsdGVkX1/..." }

See individual endpoint documentation for specific DTO schemas that need to be encrypted.`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      LoginDto,
      RegisterDto,
      RegisterOnboardingDto,
      RegisterProductDto,
      UpdateProductDto,
    ],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(port, () => {
    logger.log(`Server running on http://localhost:${port}`);
    logger.log(
      `Swagger documentation available at http://localhost:${port}/api`,
    );
  });
}
void bootstrap();
