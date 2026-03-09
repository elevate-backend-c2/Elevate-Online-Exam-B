import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/modules/auth/enums/user-role.enum';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Admin User' })
  name: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@example.com' })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Admin@123456' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole, default: UserRole.ADMIN })
  role: UserRole = UserRole.ADMIN;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true, default: true })
  active: boolean = true;
}
