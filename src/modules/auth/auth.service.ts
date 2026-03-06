import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/Login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: registerDto): Promise<{ token: string }> {
    const { name, email, password } = registerDto;

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

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(LoginDto: loginDto): Promise<{ token: string }> {
    const { email, password } = LoginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async getOrCreateGoogleUser(profile: any) {
    const { email, displayName } = profile;
    let user = await this.userModel.findOne({ email });
    if (user) return user;

    const randomPassword = Math.random().toString(36).slice(-12);
    const saltRoundsRaw = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    const saltRounds = saltRoundsRaw ? parseInt(saltRoundsRaw, 10) : 10;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    user = await this.userModel.create({
      email,
      name: displayName || email.split('@')[0],
      password: hashedPassword,
    });
    return user;
  }

  async googleRegister(profile: any): Promise<{ token: string }> {
    const user = await this.getOrCreateGoogleUser(profile);
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }
}
