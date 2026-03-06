import { Controller, Get, Param } from '@nestjs/common';
import { Quiz } from '../schemas/quiz.schema';
import { QuizzesService } from '../services/quizzes.service';

@Controller('/quizzes')
export class QuizesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(':id')
  getQuiz(@Param('id') id: string): Promise<Quiz> {
    return this.quizzesService.findQuizById(id);
  }
}
