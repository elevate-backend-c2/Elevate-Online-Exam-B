import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SuperAdminSeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const superAdmin = await this.userModel.findOne({
      //Adding role for super admin in user schema
      //role: UserRole.SUPER_ADMIN,
    });

    if (!superAdmin) {
      await this.userModel.create({
        name:
          this.configService.get<string>('SUPER_ADMIN_NAME') || 'Super Admin',
        email:
          this.configService.get<string>('SUPER_ADMIN_EMAIL') ||
          'superadmin@example.com',
        password:
          this.configService.get<string>('SUPER_ADMIN_PASSWORD') ||
          'superadminpassword',
        //role: UserRole.SUPER_ADMIN,
      });

      console.log('SuperAdmin Created');
    }
  }
}
