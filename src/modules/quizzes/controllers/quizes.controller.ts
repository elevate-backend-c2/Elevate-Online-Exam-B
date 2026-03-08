import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Quiz } from '../schemas/quiz.schema';
import { QuizzesService } from '../services/quizzes.service';
import { QuizAttemptsService } from '../services/quiz-attempts.service';
import { StartQuizDto } from '../dtos/start-quiz.dto';

@Controller('/quizzes')
export class QuizesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly quizAttemptsService: QuizAttemptsService,
  ) {}

  @Post(':quizId/attempts')
  startQuiz(
    @Param('quizId') quizId: string,
    @Body() dto: StartQuizDto,
  ) {
    return this.quizAttemptsService.startQuiz(quizId, dto);
  }

  @Get(':id')
  getQuiz(@Param('id') id: string): Promise<Quiz> {
    return this.quizzesService.findQuizById(id);
  }
}
