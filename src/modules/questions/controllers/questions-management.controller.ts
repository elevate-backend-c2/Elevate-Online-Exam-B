import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { Question } from '../schemas/question.schema';
import { QuestionsService } from '../questions.service';

@Controller('admin/quizzes/:quizId/questions')
export class QuestionsManagementController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(
    @Param('quizId') quizId: string,
    @Body() dto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.create(quizId, dto);
  }

  @Get()
  findAll(@Param('quizId') quizId: string): Promise<Question[]> {
    return this.questionsService.findAllByQuizId(quizId);
  }

  @Get(':questionId')
  findOne(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ): Promise<Question> {
    return this.questionsService.findOne(quizId, questionId);
  }

  @Patch(':questionId')
  update(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.update(quizId, questionId, dto);
  }

  @Delete(':questionId')
  delete(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ): Promise<void> {
    return this.questionsService.delete(quizId, questionId);
  }
}
