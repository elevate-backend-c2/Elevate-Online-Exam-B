import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Quiz } from './schemas/quiz.schema';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { UpdateQuizDto } from './dtos/update-quiz.dto';

@Controller('/admin/quizzes')
export class QuizzesManagementController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Post()
    createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
        return this.quizzesService.createQuiz(createQuizDto);
    }

    @Patch(':id')
    updateQuiz(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto): Promise<Quiz> {
        return this.quizzesService.updateQuiz(id, updateQuizDto);
    }
}
