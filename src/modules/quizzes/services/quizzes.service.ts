import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../schemas/quiz.schema';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectModel(Quiz.name)
        private quizModel: Model<Quiz>,
    ) {}

    async findQuizById(id: string): Promise<Quiz> {
        const quiz = await this.quizModel.findById(id);
        if (!quiz) {
        throw new NotFoundException('Quiz not found');
        }
        return quiz;
    }
}
