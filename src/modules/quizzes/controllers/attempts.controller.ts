import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { QuizAttemptsService } from '../services/quiz-attempts.service';
import { SubmitAnswerDto } from '../dtos/submit-answer.dto';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Get(':attemptId/next-question')
  getNextQuestion(
    @Param('attemptId') attemptId: string,
  ) {
    return this.quizAttemptsService.getNextQuestion(attemptId);
  }

  @Patch(':attemptId/answers')
  submitAnswer(
    @Param('attemptId') attemptId: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.quizAttemptsService.submitAnswer(attemptId, dto);
  }

  @Post(':attemptId/submit')
  submitQuiz(@Param('attemptId') attemptId: string) {
    return this.quizAttemptsService.submitQuiz(attemptId);
  }

  @Get(':attemptId/review')
  getReview(@Param('attemptId') attemptId: string) {
    return this.quizAttemptsService.getReview(attemptId);
  }
}
