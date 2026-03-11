import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsController } from './controllers/attempts.controller';
import { QuizzesManagementController } from './controllers/quizzes-management.controller';
import { QuizzesController } from './controllers/quizes.controller';
import { QuizAttemptsService } from './services/quiz-attempts.service';
import { QuizzesService } from './services/quizzes.service';
import { QuizzesManagementService } from './services/quizzes-management.service';
import { QuizAttemptsUtilService } from './services/quiz-attempts-util.service';
import { ExamAttempt, ExamAttemptSchema } from './schemas/exam-attempt.schema';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { QuestionsModule } from '../questions/questions.module';
import { TopicsModule } from '../topics/topics.module';
import { CertificatesModule } from '../certificates/certificates.module';

@Module({
  imports: [
    QuestionsModule,
    TopicsModule,
    CertificatesModule,
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: ExamAttempt.name, schema: ExamAttemptSchema },
    ]),
  ],
  controllers: [
    AttemptsController,
    QuizzesManagementController,
    QuizzesController,
  ],
  providers: [
    QuizAttemptsService,
    QuizzesService,
    QuizzesManagementService,
    QuizAttemptsUtilService,
  ],
  exports: [MongooseModule],
})
export class QuizzesModule {}
