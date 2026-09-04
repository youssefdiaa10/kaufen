import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.ts';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy.ts';
import { RefreshToken } from '../../entities/refresh-token.entity.ts';
import { User } from '../../entities/user.entity.ts';
import { AuthController } from './auth.controller.ts';
import { AuthService } from './auth.service.ts';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
