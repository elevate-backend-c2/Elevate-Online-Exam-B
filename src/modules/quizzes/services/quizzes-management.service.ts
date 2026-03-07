import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from '../../topics/schemas/topic.schema';
import { CreateQuizDto } from '../dtos/create-quiz.dto';
import { UpdateQuizDto } from '../dtos/update-quiz.dto';
import { Quiz } from '../schemas/quiz.schema';

@Injectable()
export class QuizzesManagementService {
  constructor(
    @InjectModel(Quiz.name)
    private quizModel: Model<Quiz>,
    @InjectModel(Topic.name)
    private topicModel: Model<Topic>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const isTopicExists = await this.topicModel.exists({
      _id: createQuizDto.topicId,
    });
    if (!isTopicExists) {
      throw new NotFoundException('Topic not found');
    }

    return this.quizModel.create(createQuizDto);
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, {
      new: true,
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async deleteQuiz(id: string): Promise<void> {
    const quiz = await this.quizModel.findByIdAndDelete(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  }

  async updateQuizImage(id: string, imagePath: string): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(
      id,
      { image: imagePath },
      { new: true },
    );
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }
}
