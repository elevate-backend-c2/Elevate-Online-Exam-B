import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/Login.dto';
import { ConfigService } from '@nestjs/config';
import { AuthUtilsService } from './utils/auth-utils.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
    private authUtilsService: AuthUtilsService,
  ) {}

  async register(
    registerDto: registerDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const { name, email, password } = registerDto;

    const userExist = await this.userModel.findOne({ email });
    if (userExist) {
      throw new UnauthorizedException('Email already exists');
    }

    const saltRoundsRaw = this.configService.get<string>('BCRYPT_SALT_ROUNDS');

    // we can remove this line
    if (!saltRoundsRaw) {
      throw new Error('BCRYPT_SALT_ROUNDS is required in .env file');
    }

    const saltRounds = parseInt(saltRoundsRaw, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.authUtilsService.createAccessToken(user);
    const refreshToken = this.authUtilsService.createRefreshToken(user);

    user.refreshToken = refreshToken;
    await (user as any).save();

    return { token, refreshToken };
  }

  async login(
    LoginDto: loginDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const { email, password } = LoginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.authUtilsService.createAccessToken(user);
    const refreshToken = this.authUtilsService.createRefreshToken(user);

    user.refreshToken = refreshToken;
    await (user as any).save();

    return { token, refreshToken };
  }

  validateToken(token: string): any {
    return this.authUtilsService.verifyAccessToken(token);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken: string }> {
    const payload = this.authUtilsService.verifyRefreshToken(refreshToken);

    const user = await this.userModel.findById(payload.id);

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const newAccessToken = this.authUtilsService.createAccessToken(user);
    const newRefreshToken = this.authUtilsService.createRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await (user as any).save();

    return { token: newAccessToken, refreshToken: newRefreshToken };
  }
}
