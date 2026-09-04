import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

const toUpperCaseIfString = ({ value }: { value: unknown }) => {
  return typeof value === 'string' ? value.toUpperCase() : value;
};

export class BaseUserDto {
  @IsUUID()
  @IsDefined()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;
}

export class BaseTokenDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  token!: string;
}
