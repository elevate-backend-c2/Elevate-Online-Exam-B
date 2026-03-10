import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AttemptAnswer } from '../schemas/attempt-answer.schema';
import { ExamAttempt } from '../schemas/exam-attempt.schema';
import { Quiz } from '../schemas/quiz.schema';
import { QuizDifficulty } from '../enums/quiz-difficulty.enum';
import { ExamAttemptStatus } from '../enums/exam-attempt-status.enum';
import { StartQuizDto } from '../dtos/start-quiz.dto';
import { SubmitAnswerDto } from '../dtos/submit-answer.dto';
import { Question } from '../../questions/schemas/question.schema';
import {
  areAnswersEqual,
  findQuestionDifficultyDecompositions,
  shuffleArray,
} from '../utils/quiz-attempts.util';

@Injectable()
export class QuizAttemptsService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(ExamAttempt.name) private attemptModel: Model<ExamAttempt>,
    @InjectModel(AttemptAnswer.name) private attemptAnswerModel: Model<AttemptAnswer>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async buildRandomQuestionIds(quizId: string, difficulty: QuizDifficulty): Promise<Types.ObjectId[]> {
    const quiz = await this.quizModel.findById(quizId).lean().exec();
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (!quiz.isPublished) throw new BadRequestException('Quiz is not published');
    const config = quiz.allowedQuizDifficulties?.find(
      (c) => c.difficulty === difficulty,
    );
    if (!config)
      throw new BadRequestException(
        `Difficulty ${difficulty} is not configured for this quiz`,
      );
    const N = config.numberOfQuestions;
    const P = config.points;
    const decompositions = findQuestionDifficultyDecompositions(N, P);
    if (decompositions.length === 0)
      throw new BadRequestException(
        'Invalid quiz config: no valid question count decomposition for points',
      );

    const questionsByDiff = await this.questionModel
      .find({ quizId: new Types.ObjectId(quizId) })
      .lean()
      .exec();
    const by1 = questionsByDiff.filter((q) => q.difficulty === 1);
    const by2 = questionsByDiff.filter((q) => q.difficulty === 2);
    const by3 = questionsByDiff.filter((q) => q.difficulty === 3);

    for (const [e, m, h] of shuffleArray(decompositions)) {
      if (by1.length >= e && by2.length >= m && by3.length >= h) {
        const s1 = shuffleArray(by1).slice(0, e);
        const s2 = shuffleArray(by2).slice(0, m);
        const s3 = shuffleArray(by3).slice(0, h);
        const combined = shuffleArray([...s1, ...s2, ...s3]);
        return combined.map((q) => q._id);
      }
    }
    throw new BadRequestException(
      'Not enough questions in the quiz pool for the selected difficulty',
    );
  }

  async startQuiz(
    quizId: string,
    dto: StartQuizDto,
  ): Promise<{
    attempt: ExamAttempt & { id: string };
    firstQuestion: Partial<Question> & { id: string };
  }> {
    const questionIds = await this.buildRandomQuestionIds(quizId, dto.difficulty);
    const startedAt = new Date();
    const attempt = await this.attemptModel.create({
      quizId: new Types.ObjectId(quizId),
      userId: new Types.ObjectId(dto.userId),
      status: ExamAttemptStatus.IN_PROGRESS,
      score: 0,
      startedAt,
      questionIds,
    });
    for (const qid of questionIds) {
      await this.attemptAnswerModel.create({
        attemptId: attempt._id,
        questionId: qid,
        selectedOptions: [],
        isCorrect: false,
        pointsAwarded: 0,
      });
    }
    const firstId = questionIds[0];
    const firstQuestionDoc = await this.questionModel
      .findById(firstId)
      .select('-correctAnswers -explanation')
      .lean()
      .exec();
    if (!firstQuestionDoc)
      throw new NotFoundException('First question not found');
    const attemptObj = attempt.toObject ? attempt.toObject() : attempt;
    return {
      attempt: {
        ...attemptObj,
        id: (attemptObj as any)._id?.toString(),
      } as ExamAttempt & { id: string },
      firstQuestion: {
        ...firstQuestionDoc,
        id: (firstQuestionDoc as any)._id?.toString(),
      } as Partial<Question> & { id: string },
    };
  }

  async getNextQuestion(
    attemptId: string,
  ): Promise<{ hasMore: boolean; question?: Partial<Question> & { id: string } }> {
    const attempt = await this.attemptModel.findById(attemptId).lean().exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt is not in progress');
    const questionIds = attempt.questionIds || [];
    const answers = await this.attemptAnswerModel
      .find({ attemptId: new Types.ObjectId(attemptId) })
      .lean()
      .exec();
    const answerByQ = new Map(
      answers.map((a) => [a.questionId.toString(), a]),
    );
    for (const qid of questionIds) {
      const key = qid.toString();
      const ans = answerByQ.get(key);
      if (!ans || !ans.selectedOptions || ans.selectedOptions.length === 0) {
        const q = await this.questionModel
          .findById(qid)
          .select('-correctAnswers -explanation')
          .lean()
          .exec();
        if (!q) continue;
        return {
          hasMore: true,
          question: {
            ...q,
            id: (q as any)._id?.toString(),
          } as Partial<Question> & { id: string },
        };
      }
    }
    return { hasMore: false };
  }

  async submitAnswer(
    attemptId: string,
    dto: SubmitAnswerDto,
  ): Promise<AttemptAnswer> {
    const attempt = await this.attemptModel.findById(attemptId).exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt is not in progress');
    const updated = await this.attemptAnswerModel
      .findOneAndUpdate(
        {
          attemptId: new Types.ObjectId(attemptId),
          questionId: new Types.ObjectId(dto.questionId),
        },
        { $set: { selectedOptions: dto.selectedOptions } },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Attempt answer not found');
    return updated as AttemptAnswer;
  }

  async submitQuiz(
    attemptId: string,
  ): Promise<{
    attempt: ExamAttempt & { id: string; totalPossible?: number };
    passed: boolean;
    passPercentage: number;
  }> {
    const attempt = await this.attemptModel.findById(attemptId).exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt is not in progress');

    const quiz = await this.quizModel.findById(attempt.quizId).lean().exec();
    if (!quiz) throw new NotFoundException('Quiz not found');
    const passPercentage = quiz.passPercentage;

    const answers = await this.attemptAnswerModel
      .find({ attemptId: new Types.ObjectId(attemptId) })
      .lean()
      .exec();
    const questionIds = attempt.questionIds || [];
    let totalPossible = 0;
    let score = 0;
    for (const qid of questionIds) {
      const q = await this.questionModel.findById(qid).lean().exec();
      if (!q) continue;
      totalPossible += q.difficulty;
      const ans = answers.find((a) => a.questionId.toString() === qid.toString());
      if (!ans) continue;
      const correct = areAnswersEqual(
        ans.selectedOptions || [],
        q.correctAnswers || [],
      );
      await this.attemptAnswerModel
        .updateOne(
          { _id: ans._id },
          {
            $set: {
              isCorrect: correct,
              pointsAwarded: correct ? q.difficulty : 0,
            },
          },
        )
        .exec();
      if (correct) score += q.difficulty;
    }

    const completedAt = new Date();
    const durationSeconds = attempt.startedAt
      ? Math.floor((completedAt.getTime() - attempt.startedAt.getTime()) / 1000)
      : 0;
    const percent = totalPossible > 0 ? (score / totalPossible) * 100 : 0;
    const passed = percent >= passPercentage;
    await this.attemptModel
      .updateOne(
        { _id: attemptId },
        {
          $set: {
            score,
            status: passed ? ExamAttemptStatus.PASSED : ExamAttemptStatus.FAILED,
            completedAt,
            durationSeconds,
          },
        },
      )
      .exec();

    const updatedAttempt = await this.attemptModel
      .findById(attemptId)
      .lean()
      .exec();
    const out = updatedAttempt as any;
    return {
      attempt: {
        ...out,
        id: out?._id?.toString(),
        totalPossible,
      },
      passed,
      passPercentage,
    };
  }

  async getReview(attemptId: string): Promise<{
    attempt: ExamAttempt & { id: string };
    questions: Array<{
      question: { text: string; options: string[]; correctAnswers: string[]; explanation?: string };
      selectedOptions: string[];
      isCorrect: boolean;
      pointsAwarded: number;
    }>;
  }> {
    const attempt = await this.attemptModel.findById(attemptId).lean().exec();
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status === ExamAttemptStatus.IN_PROGRESS)
      throw new BadRequestException('Attempt not yet submitted');

    const questionIds = attempt.questionIds || [];
    const answers = await this.attemptAnswerModel
      .find({ attemptId: new Types.ObjectId(attemptId) })
      .lean()
      .exec();
    const answerByQ = new Map(
      answers.map((a) => [a.questionId.toString(), a]),
    );
    const questions: Array<{
      question: { text: string; options: string[]; correctAnswers: string[]; explanation?: string };
      selectedOptions: string[];
      isCorrect: boolean;
      pointsAwarded: number;
    }> = [];
    for (const qid of questionIds) {
      const q = await this.questionModel.findById(qid).lean().exec();
      if (!q) continue;
      const ans = answerByQ.get(qid.toString());
      questions.push({
        question: {
          text: q.text,
          options: q.options || [],
          correctAnswers: q.correctAnswers || [],
          explanation: q.explanation,
        },
        selectedOptions: ans?.selectedOptions || [],
        isCorrect: ans?.isCorrect ?? false,
        pointsAwarded: ans?.pointsAwarded ?? 0,
      });
    }
    const outAttempt = attempt as any;
    return {
      attempt: { ...outAttempt, id: outAttempt._id?.toString() } as ExamAttempt & { id: string },
      questions,
    };
  }
}
