import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesManagementController } from './controllers/quizzes-management.controller';
import { QuizzesService } from './services/quizzes.service';
import { QuizzesManagementService } from './services/quizzes-management.service';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { ExamAttempt, ExamAttemptSchema } from './schemas/exam-attempt.schema';
import {
  AttemptAnswer,
  AttemptAnswerSchema,
} from './schemas/attempt-answer.schema';
import { QuestionsModule } from '../questions/questions.module';
import { QuizesController } from './controllers/quizes.controller';
import { TopicsModule } from '../topics/topics.module';

@Module({
  imports: [
    QuestionsModule,
    TopicsModule,
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: ExamAttempt.name, schema: ExamAttemptSchema },
      { name: AttemptAnswer.name, schema: AttemptAnswerSchema },
    ]),
  ],
  controllers: [QuizzesManagementController, QuizesController],
  providers: [QuizzesService, QuizzesManagementService],
  exports: [MongooseModule],
})
export class QuizzesModule {}
