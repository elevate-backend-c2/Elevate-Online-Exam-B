import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamAttempt } from '../schemas/exam-attempt.schema';
import { Quiz } from '../schemas/quiz.schema';
import { QuizDifficulty } from '../enums/quiz-difficulty.enum';
import { ExamAttemptStatus } from '../enums/exam-attempt-status.enum';
import { StartQuizDto } from '../dtos/start-quiz.dto';
import { SubmitAnswerDto } from '../dtos/submit-answer.dto';
import { Question } from '../../questions/schemas/question.schema';
import type { AttemptAnswerEntry } from '../types/attempt-answer-entry.type';
import type { AttemptReviewQuestion } from '../types/attempt-review-question.type';
import { areAnswersEqual } from '../utils/quiz-attempts.util';
import { QuizAttemptsUtilService } from './quiz-attempts-util.service';
import { CertificatesService } from '../../certificates/certificates.service';

@Injectable()
export class QuizAttemptsService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(ExamAttempt.name) private attemptModel: Model<ExamAttempt>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    private readonly quizAttemptsUtilService: QuizAttemptsUtilService,
    private readonly certificatesService: CertificatesService,
  ) {}

  private async buildRandomQuestionIds(
    quizId: string,
    difficulty: QuizDifficulty,
  ): Promise<Types.ObjectId[]> {
    return this.quizAttemptsUtilService.buildRandomQuestionIds(
      quizId,
      difficulty,
    );
  }

  async startQuiz(
    quizId: string,
    dto: StartQuizDto,
  ): Promise<{
    attempt: ExamAttempt & { id: string };
    firstQuestion: Partial<Question> & { id: string };
  }> {
    const questionIdsForAttempt = await this.buildRandomQuestionIds(
      quizId,
      dto.difficulty,
    );
    const startedAt = new Date();
    const attempt = await this.attemptModel.create({
      quizId: new Types.ObjectId(quizId),
      userId: new Types.ObjectId(dto.userId),
      status: ExamAttemptStatus.IN_PROGRESS,
      score: 0,
      startedAt,
      answers: questionIdsForAttempt.map((questionId) => ({
        questionId,
        selectedOptions: [],
        isCorrect: false,
        pointsAwarded: 0,
      })),
    });
    const firstQuestionId = questionIdsForAttempt[0];
    const firstQuestion = await this.questionModel
      .findById(firstQuestionId)
      .select('-correctAnswers -explanation')
      .lean()
      .exec();
    if (!firstQuestion) throw new NotFoundException('First question not found');
    const attemptAny = attempt as any;
    const attemptObject = attemptAny.toObject
      ? (attemptAny.toObject() as ExamAttempt)
      : (attempt as unknown as ExamAttempt);
    return {
      attempt: {
        ...attemptObject,
        id: attemptAny._id?.toString(),
      },
      firstQuestion: {
        ...firstQuestion,
        id: (firstQuestion as any)._id?.toString(),
      } as Partial<Question> & { id: string },
    };
  }

  async getNextQuestion(
    attemptId: string,
  ): Promise<{
    hasMore: boolean;
    question?: Partial<Question> & { id: string };
  }> {
    const attempt = await this.attemptModel.findById(attemptId).lean().exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt is not in progress');
    const attemptAnswers = (attempt as any).answers as AttemptAnswerEntry[];
    const answersByQuestionId = new Map(
      attemptAnswers.map((answer) => [answer.questionId.toString(), answer]),
    );
    const questionIdsInOrder = attemptAnswers.map((entry) => entry.questionId);
    for (const questionId of questionIdsInOrder) {
      const key = questionId.toString();
      const answer = answersByQuestionId.get(key);
      if (
        !answer ||
        !answer.selectedOptions ||
        answer.selectedOptions.length === 0
      ) {
        const question = await this.questionModel
          .findById(questionId)
          .select('-correctAnswers -explanation')
          .lean()
          .exec();
        if (!question) continue;
        return {
          hasMore: true,
          question: {
            ...question,
            id: (question as any)._id?.toString(),
          } as Partial<Question> & { id: string },
        };
      }
    }
    return { hasMore: false };
  }

  async submitCurrentAndGetNext(
    attemptId: string,
    dto: SubmitAnswerDto,
  ): Promise<{
    hasMore: boolean;
    question?: Partial<Question> & { id: string };
  }> {
    const attempt = await this.attemptModel
      .findById(attemptId)
      .populate('quizId')
      .exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt is not in progress');

    const quizDoc = attempt.quizId as unknown as Quiz;
    const quizDurationMinutes = quizDoc.durationMinutes;
    const now = new Date();
    if (
      attempt.startedAt &&
      now.getTime() - attempt.startedAt.getTime() >
        quizDurationMinutes * 60 * 1000
    ) {
      // time is over: finalize attempt
      await this.submitQuiz(attemptId);
      throw new BadRequestException('Time is over for this attempt');
    }

    // save current answer (if any)
    if (dto?.questionId) {
      const answers = ((attempt as any).answers ||
        []) as AttemptAnswerEntry[];
      const entry = answers.find(
        (a) => a.questionId.toString() === dto.questionId,
      );
      if (!entry) {
        throw new NotFoundException('Attempt answer not found');
      }
      entry.selectedOptions = dto.selectedOptions;
      await attempt.save();
    }

    // then return next unanswered question
    const leanAttempt = await this.attemptModel
      .findById(attemptId)
      .lean()
      .exec();
    if (!leanAttempt) throw new NotFoundException('Attempt not found');
    if (leanAttempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt is not in progress');
    const attemptAnswers = (leanAttempt as any)
      .answers as AttemptAnswerEntry[];
    const answersByQuestionId = new Map(
      attemptAnswers.map((answer) => [answer.questionId.toString(), answer]),
    );
    const questionIdsInOrder = attemptAnswers.map((entry) => entry.questionId);
    for (const questionId of questionIdsInOrder) {
      const key = questionId.toString();
      const answer = answersByQuestionId.get(key);
      if (
        !answer ||
        !answer.selectedOptions ||
        answer.selectedOptions.length === 0
      ) {
        const question = await this.questionModel
          .findById(questionId)
          .select('-correctAnswers -explanation')
          .lean()
          .exec();
        if (!question) continue;
        return {
          hasMore: true,
          question: {
            ...question,
            id: (question as any)._id?.toString(),
          } as Partial<Question> & { id: string },
        };
      }
    }
    return { hasMore: false };
  }

  async submitQuiz(attemptId: string): Promise<{
    attempt: ExamAttempt & { id: string; totalPossible?: number };
    passed: boolean;
    passPercentage: number;
    certificate?: {
      id: string;
      code: string;
      pdfBase64: string;
    };
  }> {
    const attempt = await this.attemptModel.findById(attemptId).exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt is not in progress');

    const quiz = await this.quizModel.findById(attempt.quizId).lean().exec();
    if (!quiz) throw new NotFoundException('Quiz not found');
    const passPercentage = quiz.passPercentage;

    const attemptAnswers = (((attempt as any).answers ||
      []) as AttemptAnswerEntry[]);
    const questionIdList = attemptAnswers.map((entry) => entry.questionId);
    let totalPossible = 0;
    let score = 0;
    for (const questionId of questionIdList) {
      const question = await this.questionModel
        .findById(questionId)
        .lean()
        .exec();
      if (!question) continue;
      totalPossible++;
      const answer = attemptAnswers.find(
        (a) => a.questionId.toString() === questionId.toString(),
      );
      if (!answer) continue;
      const correct = areAnswersEqual(
        answer.selectedOptions || [],
        question.correctAnswers || [],
      );
      if (answer) {
        answer.isCorrect = correct;
        answer.pointsAwarded = correct ? 1 : 0;
      }
      if (correct) score += 1;
    }

    const completedAt = new Date();
    const durationSeconds = attempt.startedAt
      ? Math.floor((completedAt.getTime() - attempt.startedAt.getTime()) / 1000)
      : 0;
    const percent = totalPossible > 0 ? (score / totalPossible) * 100 : 0;
    const passed = percent >= passPercentage;
    attempt.score = score;
    attempt.status = passed
      ? ExamAttemptStatus.PASSED
      : ExamAttemptStatus.FAILED;
    attempt.completedAt = completedAt;
    attempt.durationSeconds = durationSeconds;
    const updatedAttempt = await attempt.save();
    const out = updatedAttempt.toObject() as ExamAttempt & {
      _id?: Types.ObjectId | string;
    };

    let certificate:
      | {
          id: string;
          code: string;
          pdfBase64: string;
        }
      | undefined;

    if (passed) {
      const { certificate: cert, pdfBase64 } =
        await this.certificatesService.issueCertificateForQuizAttempt(
          updatedAttempt.userId as Types.ObjectId,
          updatedAttempt.quizId as Types.ObjectId,
          completedAt,
        );
      certificate = {
        id: (cert as any).id,
        code: cert.certificateCode,
        pdfBase64,
      };
    }
    return {
      attempt: {
        ...out,
        id: out._id ? out._id.toString() : '',
        totalPossible,
      },
      passed,
      passPercentage,
      certificate,
    };
  }

  async getReview(attemptId: string): Promise<{
    attempt: ExamAttempt & { id: string };
    questions: AttemptReviewQuestion[];
  }> {
    const attempt = await this.attemptModel.findById(attemptId).lean().exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status === ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt not yet submitted');

    const attemptAnswers = (((attempt as any).answers ||
      []) as AttemptAnswerEntry[]);
    const answersByQuestionId = new Map(
      attemptAnswers.map((answer) => [
        answer.questionId.toString(),
        answer,
      ]),
    );
    const questions: AttemptReviewQuestion[] = [];
    const questionIdList = attemptAnswers.map((entry) => entry.questionId);
    for (const questionId of questionIdList) {
      const question = await this.questionModel
        .findById(questionId)
        .lean()
        .exec();
      if (!question) continue;
      const answer = answersByQuestionId.get(questionId.toString());
      questions.push({
        question: {
          text: question.text,
          options: question.options || [],
          correctAnswers: question.correctAnswers || [],
          explanation: question.explanation,
        },
        selectedOptions: answer?.selectedOptions || [],
        isCorrect: answer?.isCorrect ?? false,
        pointsAwarded: answer?.pointsAwarded ?? 0,
      });
    }
    const outAttempt = attempt as any;
    return {
      attempt: {
        ...outAttempt,
        id: outAttempt._id?.toString(),
      } as ExamAttempt & { id: string },
      questions,
    };
  }
}
