import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.ts';
import { User } from '../../entities/user.entity.ts';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtAuthGuard],
  controllers: [UserController],
})
export class UserModule {}
