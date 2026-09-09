import { OmitType, PickType } from '@nestjs/mapped-types';
import { BaseTokenDto, BaseUserDto } from './index.dto.ts';

export class SignInDto extends OmitType(BaseUserDto, [
  'username',
  'id',
] as const) {}
export class SignUpDto extends OmitType(BaseUserDto, ['id'] as const) {}

export class VerifyDto extends BaseTokenDto {}
export class RefreshDto extends BaseTokenDto {}
