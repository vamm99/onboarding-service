import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { LoggerConfiguredModule } from './config/logger.config';

@Module({
  imports: [
    LoggerConfiguredModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        return {
          uri: configService.get<string>('mongoUri'),
          onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => logger.log('Database connected'));
            connection.on('open', () => logger.log('Database connection open'));
            connection.on('disconnected', () =>
              logger.warn('Database disconnected'),
            );
            connection.on('reconnected', () =>
              logger.log('Database reconnected'),
            );
            connection.on('disconnecting', () =>
              logger.warn('Database disconnecting'),
            );
            connection.on('error', (error) =>
              logger.error('Database error', error),
            );
            return connection;
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        errorMessage: 'Too many requests',
        throttlers: [
          {
            name: 'default',
            ttl: configService.get<number>('throttleTTL')!,
            limit: configService.get<number>('throttleLimit')!,
          },
        ],
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('redisUri'),
            port: configService.get<number>('redisPort'),
          },
          ttl: 60000,
        }),
      }),
    }),
    AuthModule,
    ProductsModule,
    OnboardingModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
