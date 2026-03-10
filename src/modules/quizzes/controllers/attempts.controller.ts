import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuizAttemptsService } from '../services/quiz-attempts.service';
import { SubmitAnswerDto } from '../dtos/submit-answer.dto';

@ApiTags('attempts')
@ApiBearerAuth('access-token')
@Controller({
  path: 'quizzes/attempts',
  version: '1',
})
export class AttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Patch(':attemptId/next')
  goToNextQuestion(
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.quizAttemptsService.submitCurrentAndGetNext(attemptId, dto);
  }

  @Post(':attemptId/submit')
  submitQuiz(@Param('attemptId') attemptId: string) {
    return this.quizAttemptsService.submitQuiz(attemptId);
  }

  @Get(':attemptId/result')
  getReview(@Param('attemptId') attemptId: string) {
    return this.quizAttemptsService.getReview(attemptId);
  }
}
