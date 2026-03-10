import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz } from '../schemas/quiz.schema';
import { Question } from '../../questions/schemas/question.schema';
import { QuizDifficulty } from '../enums/quiz-difficulty.enum';
import {
  findQuestionDifficultyDecompositions,
  shuffleArray,
} from '../utils/quiz-attempts.util';

@Injectable()
export class QuizAttemptsUtilService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  async buildRandomQuestionIds(
    quizId: string,
    difficulty: QuizDifficulty,
  ): Promise<Types.ObjectId[]> {
    const quiz = await this.quizModel.findById(quizId).lean().exec();
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (!quiz.isPublished)
      throw new BadRequestException('Quiz is not published');
    const config = quiz.allowedQuizDifficulties?.find(
      (c) => c.difficulty === difficulty,
    );
    if (!config)
      throw new BadRequestException(
        `Difficulty ${difficulty} is not configured for this quiz`,
      );
    const totalQuestions = config.numberOfQuestions;
    const totalPoints = config.points;
    const decompositions = findQuestionDifficultyDecompositions(
      totalQuestions,
      totalPoints,
    );
    if (decompositions.length === 0)
      throw new BadRequestException(
        'Invalid quiz config: no valid question count decomposition for points',
      );

    const questionsForQuiz = await this.questionModel
      .find({ quizId: new Types.ObjectId(quizId) })
      .lean()
      .exec();
    const easyQuestions = questionsForQuiz.filter(
      (question) => question.difficulty === 1,
    );
    const mediumQuestions = questionsForQuiz.filter(
      (question) => question.difficulty === 2,
    );
    const hardQuestions = questionsForQuiz.filter(
      (question) => question.difficulty === 3,
    );

    for (const [easyCount, mediumCount, hardCount] of shuffleArray(
      decompositions,
    )) {
      if (
        easyQuestions.length >= easyCount &&
        mediumQuestions.length >= mediumCount &&
        hardQuestions.length >= hardCount
      ) {
        const selectedEasy = shuffleArray(easyQuestions).slice(0, easyCount);
        const selectedMedium = shuffleArray(mediumQuestions).slice(
          0,
          mediumCount,
        );
        const selectedHard = shuffleArray(hardQuestions).slice(0, hardCount);
        const combinedSelection = shuffleArray([
          ...selectedEasy,
          ...selectedMedium,
          ...selectedHard,
        ]);
        return combinedSelection.map((question) => question._id);
      }
    }
    throw new BadRequestException(
      'Not enough questions in the quiz pool for the selected difficulty',
    );
  }
}

