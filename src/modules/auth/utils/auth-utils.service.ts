import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class AuthUtilsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(user: User): string {
    return this.jwtService.sign({
      id: (user as any)._id,
      role: user.role,
      allowedDiplomas: (user as any).allowedDiplomas,
      type: 'access',
    });
  }

  createRefreshToken(user: User): string {
    const refreshExpires =
      (this.configService.get<string>('REFRESH_JWT_EXPIRES') as string) || '7d';

    return this.jwtService.sign(
      {
        id: (user as any)._id,
        type: 'refresh',
      },
      { expiresIn: refreshExpires as any },
    );
  }

  verifyAccessToken(token: string): any {
    try {
      const payload = this.jwtService.verify(token);

      if (!payload || payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      const payload = this.jwtService.verify(token);

      if (!payload || payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
