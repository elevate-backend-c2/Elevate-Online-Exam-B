import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/modules/users/schemas/user.schema';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
  role: UserRole = UserRole.ADMIN;
  active: boolean = true;
}
