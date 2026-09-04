import { Body, Controller, Patch, Post } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator.ts';
import {
  RefreshDto,
  SignInDto,
  SignUpDto,
  VerifyDto,
} from '../../dtos/auth.dto.ts';
import { AuthService } from './auth.service.ts';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }

  @Post('/sign-in')
  signIn(@Body() signIn: SignInDto) {
    return this.authService.signIn(signIn);
  }

  @Patch('/verify')
  verify(@Body() verify: VerifyDto) {
    return this.authService.verify(verify);
  }

  @Post('/refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
