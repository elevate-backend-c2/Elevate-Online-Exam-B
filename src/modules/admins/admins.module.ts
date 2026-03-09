import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { SuperAdminSeedService } from './admins.seed';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Diploma, DiplomaSchema } from '../diplomas/schemas/diploma.schema';
import {
  SuperAdminAuditLog,
  SuperAdminAuditLogSchema,
} from './schemas/admins-audit-logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Diploma.name, schema: DiplomaSchema },
      { name: SuperAdminAuditLog.name, schema: SuperAdminAuditLogSchema },
    ]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService, SuperAdminSeedService],
  exports: [MongooseModule],
})
export class AdminsModule {}
