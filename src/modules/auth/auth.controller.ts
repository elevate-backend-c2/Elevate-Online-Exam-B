import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() RegisterDto: registerDto): Promise<{ token: string }> {
    return this.authService.register(RegisterDto);
  }
}
