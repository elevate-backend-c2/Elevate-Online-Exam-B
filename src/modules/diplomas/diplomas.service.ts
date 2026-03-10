import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, QueryFilter } from 'mongoose';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { CreateDiplomaDto } from 'src/modules/diplomas/dto/create-diploma.dto';
import { GetDiplomasDto } from 'src/modules/diplomas/dto/get-diplomas.dto';
import { UpdateDiplomaDto } from 'src/modules/diplomas/dto/update-diploma.dto';
import { Diploma } from 'src/modules/diplomas/schemas/diploma.schema';
import { Enrollment } from 'src/modules/diplomas/schemas/enrollment.schema';
import { Quiz } from 'src/modules/quizzes/schemas/quiz.schema';

@Injectable()
export class DiplomasService {
  constructor(
    @InjectModel(Diploma.name) private readonly diplomaModel: Model<Diploma>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    private readonly paginationService: PaginationService,
  ) {}

  async createDiploma(dto: CreateDiplomaDto) {
    const { title, description } = dto;
    const existingDiploma = await this.diplomaModel.findOne({ title }).lean();

    if (existingDiploma) {
      throw new ConflictException(
        `Diploma with title "${title}" already exists`,
      );
    }

    return await this.diplomaModel.create({
      title,
      description,
      issuedAt: new Date(),
      createdBy: 'creatorId',
    });
  }

  async updateDiploma(id: string, dto: UpdateDiplomaDto) {
    const { title } = dto;

    if (title) {
      const existing = await this.diplomaModel
        .findOne({
          title,
          _id: { $ne: id },
        })
        .lean();

      if (existing) {
        throw new ConflictException(
          `Another diploma already has the title: "${title}"`,
        );
      }
    }

    const updatedDiploma = await this.diplomaModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true })
      .lean();

    if (!updatedDiploma) {
      throw new NotFoundException('Diploma not found');
    }

    return updatedDiploma;
  }

  async deleteDiploma(id: string) {
    const exists = await this.diplomaModel.exists({ _id: id });
    if (!exists) throw new NotFoundException('Diploma not found');

    await Promise.all([
      this.enrollmentModel.deleteMany({ diplomaId: id }),
      this.quizModel.deleteMany({ diplomaId: id }),
    ]);

    await this.diplomaModel.findByIdAndDelete(id);

    return { message: 'Diploma deleted successfully' };
  }

  async getDiplomas(dto: GetDiplomasDto, request: Request) {
    const { search, sortBy, order, ...filters } = dto;

    const queryFilters: QueryFilter<Diploma> = {};

    if (search) {
      const words = search.split(' ').filter((word) => word.length > 0);
      if (words.length > 0) {
        queryFilters.$and = words.map((word) => ({
          $or: [
            { title: { $regex: word, $options: 'i' } },
            { description: { $regex: word, $options: 'i' } },
          ],
        }));
      }
    }

    if (filters.issuedAt) {
      queryFilters.issuedAt = { $gte: filters.issuedAt };
    }

    const sortOptions = sortBy
      ? { [sortBy]: order === 'asc' ? 1 : -1 }
      : { createdAt: -1 };

    return await this.paginationService.paginateQuery(
      this.diplomaModel,
      dto,
      queryFilters,
      request,
      sortOptions,
    );
  }

  async getDiplomaById(id: string) {
    const diploma = await this.diplomaModel.findById(id);
    if (!diploma) throw new NotFoundException('This diploma is not exist');

    return diploma;
  }

  async enroll(diplomaId: string, request: Request) {
    const user = (request as any).user;
    const studentId = user?.id;

    if (!studentId) {
      throw new BadRequestException('Invalid authenticated user');
    }

    await this.getDiplomaById(diplomaId);
    
    const isEnrolled = await this.enrollmentModel.findOne({
      studentId,
      diplomaId,
    });

    if (isEnrolled) {
      throw new BadRequestException(
        'You are already enrolled into this diploma',
      );
    }

    return await this.enrollmentModel.create({ studentId, diplomaId });
  }

  async getDiplomaQuizzes(diplomaId: string) {
    await this.getDiplomaById(diplomaId);
    const quizzes = await this.quizModel.find({ diplomaId });
    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException('No quizzes found for this diploma');
    }

    return quizzes;
  }

  async getEnrolledDiplomas(dto: GetDiplomasDto, request: Request) {
    const user = (request as any).user;
    const studentId = user?.id;

    if (!studentId) {
      throw new BadRequestException('Invalid authenticated user');
    }
    const enrollments = await this.enrollmentModel
      .find({ studentId })
      .select('diplomaId')
      .lean();

    if (!enrollments.length) return [];
    const diplomaIds = enrollments.map((enrollment) => enrollment.diplomaId);

    const queryFilters: QueryFilter<Diploma> = { _id: { $in: diplomaIds } };

    return await this.paginationService.paginateQuery(
      this.diplomaModel,
      dto,
      queryFilters,
      request,
    );
  }
}
