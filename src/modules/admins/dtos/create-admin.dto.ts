import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/modules/users/schemas/user.schema';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  role: UserRole = UserRole.ADMIN;
  active: boolean = true;
}
