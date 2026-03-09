import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRole } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Diploma } from '../diplomas/schemas/diploma.schema';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { SuperAdminAuditLog } from './schemas/admins-audit-logs.schema';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Diploma.name) private diplomaModel: Model<Diploma>,
    @InjectModel(SuperAdminAuditLog.name)
    private superAdminAuditLogModel: Model<SuperAdminAuditLog>,
  ) {}

  async createAdmin(dto: CreateAdminDto, superAdmin) {
    const existingAdmin = await this.userModel.findOne({ email: dto.email });

    if (existingAdmin) {
      throw new BadRequestException('Email already exists');
    }
    const newAdmin = await this.userModel.create(dto);
    await this.superAdminAuditLogModel.create({
      action: 'CREATE_ADMIN',
      performedBy: superAdmin.id,
      targetId: newAdmin._id,
    });

    return {
      status: 'success',
      message: 'Admin created successfully',
    };
  }
  async updateAdminDiplomas(id: string, allowedDiplomas: string[], superAdmin) {
    const admin = await this.userModel.findById(id);

    if (!admin) {
      throw new NotFoundException('User not found');
    }

    const diplomas = await this.diplomaModel
      .find({
        _id: { $in: allowedDiplomas },
      })
      .select('_id');

    const foundIds = diplomas.map((d) => d._id.toString());

    const invalidIds = allowedDiplomas.filter((id) => !foundIds.includes(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Diplomas not found: ${invalidIds.join(', ')}`,
      );
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        $addToSet: {
          allowedDiplomas: { $each: allowedDiplomas },
        },
      },
    );

    await this.superAdminAuditLogModel.create({
      action: 'UPDATE_ADMIN_PERMISSIONS',
      performedBy: superAdmin.id,
      targetId: admin._id,
    });

    return {
      status: 'success',
      message: "Admin's diplomas updated successfully",
    };
  }
  async deactivateAdmin(adminId: string, superAdmin) {
    const admin = await this.userModel.findOneAndUpdate(
      { _id: adminId, role: UserRole.ADMIN },
      { active: false },
      { new: true },
    );

    if (!admin) {
      throw new NotFoundException(
        'Admin not found or this id is not belong to admin',
      );
    }
    await this.superAdminAuditLogModel.create({
      action: 'DEACTIVATE_ADMIN',
      performedBy: superAdmin.id,
      targetId: admin._id,
    });

    return {
      status: 'success',
      message: 'Admin deactivated successfully',
    };
  }
  getAuditLogs() {
    return this.superAdminAuditLogModel.find();
  }
}
