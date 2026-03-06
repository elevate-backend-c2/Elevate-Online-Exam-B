import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/Login.dto';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('api/v1/auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() RegisterDto: registerDto): Promise<{ token: string }> {
    return this.authService.register(RegisterDto);
  }

  @Post('/login')
  login(@Body() LoginDto: loginDto): Promise<{ token: string }> {
    return this.authService.login(LoginDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.googleRegister(req.user);
    res.redirect(`http://localhost:3000?token=${response.token}`); // Redirection for the front
  }
}
