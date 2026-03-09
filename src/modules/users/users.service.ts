/* eslint-disable @typescript-eslint/require-await */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as unknown as User;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updateProfileDto, {
        new: true,
      })
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as unknown as User;
  }

  async deactivateAccount(userId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { active: false },
        {
          new: true,
        },
      )
      .select('-password -refreshToken')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as unknown as User;
  }

  async getStatistics(userId: string): Promise<any> {
    // TODO: Implement this
    return {
      userId,
      totalExams: 0,
      passedExams: 0,
      certificatesCount: 0,
    };
  }

  async getExamHistory(
    userId: string,
    pagination: PaginationDto,
  ): Promise<any> {
    const { page = 1, limit = 10 } = pagination;

    // TODO: Implement this
    return {
      userId,
      items: [],
      page,
      limit,
      total: 0,
    };
  }

  async getCertificates(
    userId: string,
    pagination: PaginationDto,
  ): Promise<any> {
    const { page = 1, limit = 10 } = pagination;

    // TODO: Implement this
    return {
      userId,
      items: [],
      page,
      limit,
      total: 0,
    };
  }
}
