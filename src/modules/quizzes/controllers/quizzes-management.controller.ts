import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Quiz } from '../schemas/quiz.schema';
import { CreateQuizDto } from '../dtos/create-quiz.dto';
import { UpdateQuizDto } from '../dtos/update-quiz.dto';
import { QuizzesManagementService } from '../services/quizzes-management.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';
import { DiplomaAccess } from '../../auth/decorators/diploma-access.decorator';
import {
  QUIZ_UPLOAD_DIR,
  ensureQuizUploadDir,
  generateQuizImageFilename,
} from '../utils/quiz-image.util';

@ApiTags('quizzes-admin')
@ApiBearerAuth('access-token')
@Controller({
  path: 'admin/quizzes',
  version: '1',
})
export class QuizzesManagementController {
  constructor(
    private readonly quizzesManagementService: QuizzesManagementService,
  ) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'topicBody', key: 'topicId' })
  @Post()
  createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizzesManagementService.createQuiz(createQuizDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'topicBody', key: 'topicId' })
  @Patch(':id')
  updateQuiz(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    return this.quizzesManagementService.updateQuiz(id, updateQuizDto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  deleteQuiz(@Param('id') id: string): Promise<void> {
    return this.quizzesManagementService.deleteQuiz(id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post(':id/image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      // TODO: use file storage module once it's ready
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureQuizUploadDir();
          cb(null, QUIZ_UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          cb(null, generateQuizImageFilename(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype?.startsWith('image/')) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadQuizImage(
    @Param('id') id: string,
    @UploadedFile()
    file?: { filename: string; mimetype?: string; originalname?: string },
  ): Promise<Quiz> {
    if (!file) {
      throw new BadRequestException(
        'Invalid image upload. Please upload an image file (max 5MB) using form-data field "image".',
      );
    }

    const imagePath = `/uploads/quizzes/${file.filename}`;
    return this.quizzesManagementService.updateQuizImage(id, imagePath);
  }
}
