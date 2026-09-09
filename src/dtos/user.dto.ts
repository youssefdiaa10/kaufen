import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsDefined, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { BaseUserDto } from './index.dto.ts';

export class GetCurrentUserDto extends PickType(BaseUserDto, ['email']) {}
export class UpdateCurrentUserDto extends OmitType(BaseUserDto, [
  'id',
  'password',
]) {}
export class UpdateCurrentPasswordDto {
  @IsDefined()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  currentPassword!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  oldPassword!: string;
}
