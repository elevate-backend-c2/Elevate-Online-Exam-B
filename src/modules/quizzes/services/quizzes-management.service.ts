import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from '../../topics/schemas/topic.schema';
import { Question } from '../../questions/schemas/question.schema';
import { CreateQuizDto } from '../dtos/create-quiz.dto';
import { UpdateQuizDto } from '../dtos/update-quiz.dto';
import { Quiz } from '../schemas/quiz.schema';
import { AllowedQuizDifficultyLevelsDto } from '../dtos/allowed-quiz-difficulty-levels.dto';
import { findQuestionDifficultyDecompositions } from '../utils/quiz-attempts.util';

@Injectable()
export class QuizzesManagementService {
  constructor(
    @InjectModel(Quiz.name)
    private quizModel: Model<Quiz>,
    @InjectModel(Topic.name)
    private topicModel: Model<Topic>,
    @InjectModel(Question.name)
    private questionModel: Model<Question>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const isTopicExists = await this.topicModel.exists({
      _id: createQuizDto.topicId,
    });
    if (!isTopicExists) {
      throw new NotFoundException('Topic not found');
    }

    return this.quizModel.create(createQuizDto);
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, {
      new: true,
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async deleteQuiz(id: string): Promise<void> {
    const quiz = await this.quizModel.findByIdAndDelete(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  }

  async updateAllowedDifficulties(
    id: string,
    dto: AllowedQuizDifficultyLevelsDto,
  ): Promise<Quiz> {
    const quiz = await this.quizModel
      .findByIdAndUpdate(
        id,
        { allowedQuizDifficulties: dto.levels },
        { new: true, runValidators: true },
      )
      .exec();

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async publishQuiz(id: string): Promise<Quiz> {
    const quiz = await this.quizModel.findById(id).lean().exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const configs = quiz.allowedQuizDifficulties || [];
    if (configs.length === 0) {
      throw new BadRequestException(
        'Quiz must have allowed difficulty configurations before publishing',
      );
    }

    const questionsForQuiz = await this.questionModel
      .find({ quizId: quiz._id })
      .lean()
      .exec();

    if (!questionsForQuiz.length) {
      throw new BadRequestException(
        'Quiz must have questions before publishing',
      );
    }

    const easyQuestions = questionsForQuiz.filter((q) => q.difficulty === 1);
    const mediumQuestions = questionsForQuiz.filter((q) => q.difficulty === 2);
    const hardQuestions = questionsForQuiz.filter((q) => q.difficulty === 3);

    for (const cfg of configs) {
      const requiredQuestionCount = cfg.numberOfQuestions;
      const requiredPoints = cfg.points;

      const decompositions = findQuestionDifficultyDecompositions(
        requiredQuestionCount,
        requiredPoints,
      );
      if (!decompositions.length) {
        throw new BadRequestException(
          `Invalid configuration for difficulty "${cfg.difficulty}": cannot decompose ${requiredPoints} points across ${requiredQuestionCount} questions (1-3 points each)`,
        );
      }

      const hasFeasibleCombination = decompositions.some(
        ([easyCount, mediumCount, hardCount]) =>
          easyQuestions.length >= easyCount &&
          mediumQuestions.length >= mediumCount &&
          hardQuestions.length >= hardCount,
      );

      if (!hasFeasibleCombination) {
        throw new BadRequestException(
          `Not enough questions to support difficulty "${cfg.difficulty}" with ${requiredQuestionCount} questions and ${requiredPoints} points`,
        );
      }
    }

    const updated = await this.quizModel
      .findByIdAndUpdate(
        id,
        { isPublished: true },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Quiz not found');
    }

    return updated;
  }

  async updateQuizImage(id: string, imagePath: string): Promise<Quiz> {
    const quiz = await this.quizModel.findByIdAndUpdate(
      id,
      { image: imagePath },
      { new: true },
    );
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }
}
