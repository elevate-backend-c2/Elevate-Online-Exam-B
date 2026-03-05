import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/Login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() RegisterDto: registerDto): Promise<{ token: string }> {
    return this.authService.register(RegisterDto);
  }

  @Get('/login')
  login(@Body() LoginDto: loginDto): Promise<{ token: string }> {
    return this.authService.login(LoginDto);
  }
}
