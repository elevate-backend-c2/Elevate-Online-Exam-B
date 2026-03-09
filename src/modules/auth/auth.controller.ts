import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/Login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  register(
    @Body() RegisterDto: registerDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.register(RegisterDto);
  }

  @Public()
  @Post('/login')
  login(
    @Body() LoginDto: loginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(LoginDto);
  }

  @Public()
  @Post('/refresh-token')
  refresh(
    @Body() body: { refreshToken: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(body.refreshToken);
  }

}
