import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.ts';
import { AppService } from './app.service.ts';
import { AuthModule } from './modules/auth/auth.module.ts';
import { UserModule } from './modules/user/user.module.js';
import configuration from './config/configuration.ts';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    //! 2. Use forRootAsync to inject ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres'>('database.postgres.type'),
        host: configService.get<string>('database.postgres.host'),
        port: configService.get<number>('database.postgres.port'),
        username: configService.get<string>('database.postgres.username'),
        password: configService.get<string>('database.postgres.password'),
        database: configService.get<string>('database.postgres.database'),
        synchronize: configService.get<boolean>(
          'database.postgres.synchronize',
        ),

        //! 3. This automatically loads all entities registered via
        //! TypeOrmModule.forFeature() in your User and Todos modules
        autoLoadEntities: true,
      }),
    }),

    //! Distributed tracing, auto-correlated logs, request/job metrics, error
    //! telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'kaufen',
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
