import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Diploma } from '../diplomas/schemas/diploma.schema';
// import { CreateAdminDto } from './dtos/create-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Diploma.name) private diplomaModel: Model<Diploma>,
  ) {}
  async createAdmin() {}
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
      message: "Admin's diplomas updated successfully",
    };
  }
  deactivateAdmin() {
    throw new Error('Method not implemented.');
  }
}
