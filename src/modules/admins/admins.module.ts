import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { SuperAdminSeedService } from './admins.seed';

@Module({
  imports: [
    //User module should export the user model and import it here to use in seeding super admin
    //UserModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService, SuperAdminSeedService],
  exports: [MongooseModule],
})
export class AdminsModule {}
