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

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Diploma.name) private diplomaModel: Model<Diploma>,
  ) {}
  async createAdmin(dto: CreateAdminDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    await this.userModel.create(dto);
    return {
      status: 'success',
      message: 'Admin created successfully',
    };
  }
  async updateAdminDiplomas(id: string, allowedDiplomas: string[]) {
    const user = await this.userModel.findById(id);

    if (!user) {
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
    return {
      status: 'success',
      message: "Admin's diplomas updated successfully",
    };
  }
  async deactivateAdmin(adminId: string) {
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
    return {
      status: 'success',
      message: 'Admin deactivated successfully',
    };
  }
}
