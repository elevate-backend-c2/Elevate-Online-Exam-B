import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

export class registerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test' })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Enter correct email' })
  @ApiProperty({ example: 'test@gmail.com' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).*$/, {
    message:
      'Password too weak. It must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
  })
  @ApiProperty({ example: '12345##' })
  readonly password: string;

  @IsEnum(Roles)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
