import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { UpdateQuestionDto } from '../dtos/update-question.dto';
import { Question } from '../schemas/question.schema';
import { QuestionsService } from '../questions.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';
import { DiplomaAccess } from '../../auth/decorators/diploma-access.decorator';

@ApiTags('questions-admin')
@ApiBearerAuth('access-token')
@Controller({
  path: 'admin/quizzes/:quizId/questions',
  version: '1',
})
export class QuestionsManagementController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'quizParam', key: 'quizId' })
  @Post()
  create(
    @Param('quizId') quizId: string,
    @Body() dto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.create(quizId, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'quizParam', key: 'quizId' })
  @Get()
  findAll(@Param('quizId') quizId: string): Promise<Question[]> {
    return this.questionsService.findAllByQuizId(quizId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'quizParam', key: 'quizId' })
  @Get(':questionId')
  findOne(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ): Promise<Question> {
    return this.questionsService.findOne(quizId, questionId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'quizParam', key: 'quizId' })
  @Patch(':questionId')
  update(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.update(quizId, questionId, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'quizParam', key: 'quizId' })
  @Delete(':questionId')
  delete(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
  ): Promise<void> {
    return this.questionsService.delete(quizId, questionId);
  }
}
