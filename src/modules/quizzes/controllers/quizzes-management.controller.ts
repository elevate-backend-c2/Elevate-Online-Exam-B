import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { Quiz } from '../schemas/quiz.schema';
import { CreateQuizDto } from '../dtos/create-quiz.dto';
import { UpdateQuizDto } from '../dtos/update-quiz.dto';
import { QuizzesManagementService } from '../services/quizzes-management.service';

@Controller('/admin/quizzes')
export class QuizzesManagementController {
  constructor(
    private readonly quizzesManagementService: QuizzesManagementService,
  ) {}

  @Post()
  createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizzesManagementService.createQuiz(createQuizDto);
  }

  @Patch(':id')
  updateQuiz(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    return this.quizzesManagementService.updateQuiz(id, updateQuizDto);
  }

  @Delete(':id')
  deleteQuiz(@Param('id') id: string): Promise<void> {
    return this.quizzesManagementService.deleteQuiz(id);
  }
}
