import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard.ts';
import {
  UpdateCurrentPasswordDto,
  UpdateCurrentUserDto,
} from '../../dtos/user.dto.ts';
import { UserService } from './user.service.ts';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get-user')
  getCurrentUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getCurrentUser(id);
  }

  @Patch('/update-user/:id')
  updateCurrentUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCurrentUserDto: UpdateCurrentUserDto,
  ) {
    return this.userService.updateCurrentUser(id, updateCurrentUserDto);
  }

  @Patch('/update-password/:id')
  updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCurrentPasswordDto: UpdateCurrentPasswordDto,
  ) {
    return this.userService.updateCurrentPassword(id, updateCurrentPasswordDto);
  }

  @Delete('/delete-user/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
