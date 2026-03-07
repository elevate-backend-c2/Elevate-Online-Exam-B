import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { Question } from './schemas/question.schema';
import { Quiz } from '../quizzes/schemas/quiz.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<Question>,
    @InjectModel(Quiz.name)
    private quizModel: Model<Quiz>,
  ) {}

  async create(quizId: string, dto: CreateQuestionDto): Promise<Question> {
    const quizExists = await this.quizModel.exists({ _id: new Types.ObjectId(quizId) });
    if (!quizExists) {
      throw new NotFoundException('Quiz not found');
    }
    if (!dto.createdBy) {
      throw new BadRequestException('createdBy is required');
    }
    const doc = await this.questionModel.create({
      quizId: new Types.ObjectId(quizId),
      text: dto.text,
      type: dto.type,
      options: dto.options,
      correctAnswers: dto.correctAnswers,
      explanation: dto.explanation,
      difficulty: dto.difficulty,
      createdBy: new Types.ObjectId(dto.createdBy),
    });
    return doc;
  }

  // TODO: add pagination
  async findAllByQuizId(quizId: string): Promise<Question[]> {
    return this.questionModel
      .find({ quizId: new Types.ObjectId(quizId) })
      .lean()
      .exec();
  }

  async findOne(quizId: string, questionId: string): Promise<Question> {
    const question = await this.questionModel
      .findOne({
        _id: new Types.ObjectId(questionId),
        quizId: new Types.ObjectId(quizId),
      })
      .lean()
      .exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question as Question;
  }

  async update(
    quizId: string,
    questionId: string,
    dto: UpdateQuestionDto,
  ): Promise<Question> {
    const existing = await this.questionModel.findOne({
      _id: new Types.ObjectId(questionId),
      quizId: new Types.ObjectId(quizId),
    });
    if (!existing) {
      throw new NotFoundException('Question not found');
    }
    const update: Partial<Question> = {};
    if (dto.text !== undefined) update.text = dto.text;
    if (dto.type !== undefined) update.type = dto.type;
    if (dto.options !== undefined) update.options = dto.options;
    if (dto.correctAnswers !== undefined) update.correctAnswers = dto.correctAnswers;
    if (dto.explanation !== undefined) update.explanation = dto.explanation;
    if (dto.difficulty !== undefined) update.difficulty = dto.difficulty;
    if (dto.createdBy !== undefined) update.createdBy = new Types.ObjectId(dto.createdBy) as any;

    const updated = await this.questionModel
      .findByIdAndUpdate(questionId, update, { new: true })
      .lean()
      .exec();
    return updated as Question;
  }

  async delete(quizId: string, questionId: string): Promise<void> {
    const result = await this.questionModel
      .findOneAndDelete({
        _id: new Types.ObjectId(questionId),
        quizId: new Types.ObjectId(quizId),
      })
      .exec();
    if (!result) {
      throw new NotFoundException('Question not found');
    }
  }
}
