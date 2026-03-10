import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from '../quizzes/schemas/quiz.schema';
import { QuestionsManagementController } from './controllers/questions-management.controller';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question, QuestionSchema } from './schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Quiz.name, schema: QuizSchema },
    ]),
  ],
  controllers: [QuestionsController, QuestionsManagementController],
  providers: [QuestionsService],
  exports: [MongooseModule],
})
export class QuestionsModule {}

