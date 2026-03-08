import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsController } from './controllers/attempts.controller';
import { QuizzesManagementController } from './controllers/quizzes-management.controller';
import { QuizesController } from './controllers/quizes.controller';
import { QuizAttemptsService } from './services/quiz-attempts.service';
import { QuizzesService } from './services/quizzes.service';
import { QuizzesManagementService } from './services/quizzes-management.service';
import {
  AttemptAnswer,
  AttemptAnswerSchema,
} from './schemas/attempt-answer.schema';
import { ExamAttempt, ExamAttemptSchema } from './schemas/exam-attempt.schema';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { QuestionsModule } from '../questions/questions.module';
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
  controllers: [
    AttemptsController,
    QuizzesManagementController,
    QuizesController,
  ],
  providers: [
    QuizAttemptsService,
    QuizzesService,
    QuizzesManagementService,
  ],
  exports: [MongooseModule],
})
export class QuizzesModule {}
