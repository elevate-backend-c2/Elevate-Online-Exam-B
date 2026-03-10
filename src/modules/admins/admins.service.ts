import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { UserRole } from '../auth/enums/user-role.enum';
import { Model } from 'mongoose';
import { Diploma } from '../diplomas/schemas/diploma.schema';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { SuperAdminAuditLog } from './schemas/admins-audit-logs.schema';
import {
  AdminListItem,
  AdminSimpleResponse,
  PaginatedAdminsResponse,
} from './types/admin-responses.type';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Diploma.name) private diplomaModel: Model<Diploma>,
    @InjectModel(SuperAdminAuditLog.name)
    private superAdminAuditLogModel: Model<SuperAdminAuditLog>,
  ) {}

  async createAdmin(
    dto: CreateAdminDto,
    superAdmin: { id: string },
  ): Promise<AdminSimpleResponse> {
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

  async updateAdminDiplomas(
    id: string,
    allowedDiplomas: string[],
    superAdmin: { id: string },
  ): Promise<AdminSimpleResponse> {
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

  async deactivateAdmin(
    adminId: string,
    superAdmin: { id: string },
  ): Promise<AdminSimpleResponse> {
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

  async getAuditLogs(): Promise<SuperAdminAuditLog[]> {
    return this.superAdminAuditLogModel.find().exec();
  }

  async getAdmins(
    page: number,
    limit: number,
  ): Promise<PaginatedAdminsResponse> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.userModel
        .find({ role: UserRole.ADMIN })
        .skip(skip)
        .limit(limit)
        .select('name email active allowedDiplomas')
        .lean(),
      this.userModel.countDocuments({ role: UserRole.ADMIN }),
    ]);

    const mapped: AdminListItem[] = items.map((u: any) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      active: u.active,
      allowedDiplomas: (u.allowedDiplomas || []).map((id: any) => String(id)),
    }));

    return {
      items: mapped,
      page,
      limit,
      total,
    };
  }

  async getAdminsByDiploma(
    diplomaId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedAdminsResponse> {
    const skip = (page - 1) * limit;

    const query = {
      role: UserRole.ADMIN,
      allowedDiplomas: diplomaId,
    };

    const [items, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .select('name email active allowedDiplomas')
        .lean(),
      this.userModel.countDocuments(query),
    ]);

    const mapped: AdminListItem[] = items.map((u: any) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      active: u.active,
      allowedDiplomas: (u.allowedDiplomas || []).map((id: any) => String(id)),
    }));

    return {
      items: mapped,
      page,
      limit,
      total,
    };
  }
}
