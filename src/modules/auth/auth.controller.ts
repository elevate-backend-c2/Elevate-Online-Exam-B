import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/Login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@Public()
@ApiTags('api/v1/auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body() RegisterDto: registerDto,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authService.register(RegisterDto);
  }

  @Post('/login')
  login(
    @Body() LoginDto: loginDto,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authService.login(LoginDto);
  }

  @Public()
  @Post('/refresh')
  refresh(
    @Body() body: { refreshToken: string },
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authService.refreshToken(body.refreshToken);
  }

}
