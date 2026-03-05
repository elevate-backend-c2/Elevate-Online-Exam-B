import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  @ApiProperty({ example: '12345##' })
  readonly password: string;
}
