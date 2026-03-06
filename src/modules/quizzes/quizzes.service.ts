import { Injectable } from '@nestjs/common';
import { Quiz } from './schemas/quiz.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuizDto } from './dtos/create-quiz.dto';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectModel(Quiz.name)
        private quizModel: Model<Quiz>,
    ) {}

    async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
        const quiz = await this.quizModel.create(createQuizDto);
        return quiz;
    }
}
