import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { DiplomasService } from './diplomas.service';
import { GetDiplomasDto } from './dto/get-diplomas.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('diplomas')
@ApiBearerAuth('access-token')
@Controller({
  path: 'diplomas',
  version: '1',
})
export class DiplomasController {
  constructor(private readonly diplomasService: DiplomasService) {}

  @Public()
  @Get()
  getDiplomas(@Query() dto: GetDiplomasDto, @Req() request: Request) {
    return this.diplomasService.getDiplomas(dto, request);
  }

  @Public()
  @Get('enrolled')
  getEnrolledDiplomas(@Query() dto: GetDiplomasDto, @Req() request: Request) {
    return this.diplomasService.getEnrolledDiplomas(dto, request);
  }

  @Public()
  @Get(':id')
  getDiplomaById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.getDiplomaById(id);
  }

  @Public()
  @Post(':id/enroll')
  enroll(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.enroll(id);
  }

  @Public()
  @Get(':id/quizzes')
  getDiplomaQuizzes(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.getDiplomaQuizzes(id);
  }
}
