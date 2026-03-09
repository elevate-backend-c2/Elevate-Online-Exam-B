import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { UserRole } from '../auth/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SuperAdminSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const superAdmin = await this.userModel.findOne({
      role: UserRole.SUPER_ADMIN,
    });

    if (!superAdmin) {
      const saltRoundsRaw =
        this.configService.get<string>('BCRYPT_SALT_ROUNDS') || '10';
      const saltRounds = parseInt(saltRoundsRaw, 10);

      const plainPassword =
        this.configService.get<string>('SUPER_ADMIN_PASSWORD') ||
        'superadminpassword';
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      await this.userModel.create({
        name:
          this.configService.get<string>('SUPER_ADMIN_NAME') || 'Super Admin',
        email:
          this.configService.get<string>('SUPER_ADMIN_EMAIL') ||
          'superadmin@example.com',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
      });

      console.log('SuperAdmin Created');
    }
  }
}
