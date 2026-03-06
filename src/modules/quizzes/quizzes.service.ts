import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from './schemas/quiz.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { Topic } from '../topics/schemas/topic.schema';
import { UpdateQuizDto } from './dtos/update-quiz.dto';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectModel(Quiz.name)
        private quizModel: Model<Quiz>,
        @InjectModel(Topic.name)
        private topicModel: Model<Topic>,
    ) {}

    async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
        const isTopicExists = await this.topicModel.exists({ _id: createQuizDto.topicId });
        if (!isTopicExists) {
            throw new NotFoundException('Topic not found');
        }
        const quiz = await this.quizModel.create(createQuizDto);
        return quiz;
    }

    async updateQuiz(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
        const quiz = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, { new: true });
        if (!quiz) {
            throw new NotFoundException('Quiz not found');
        }
        return quiz;
    }

    async findQuizById(id: string): Promise<Quiz> {
        const quiz = await this.quizModel.findById(id);
        if (!quiz) {
            throw new NotFoundException('Quiz not found');
        }
        return quiz;
    }
}
