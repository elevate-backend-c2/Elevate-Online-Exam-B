import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { DiplomasService } from 'src/modules/diplomas/diplomas.service';
import { GetDiplomasDto } from 'src/modules/diplomas/dto/get-diplomas.dto';

@ApiTags('Diplomas')
@Controller('diplomas')
export class DiplomasController {
  constructor(private readonly diplomasService: DiplomasService) {}

  @Get()
  getDiplomas(@Query() dto: GetDiplomasDto, @Req() request: Request) {
    return this.diplomasService.getDiplomas(dto, request);
  }

  @Get('enrolled')
  getEnrolledDiplomas(@Query() dto: GetDiplomasDto, @Req() request: Request) {
    return this.diplomasService.getEnrolledDiplomas(dto, request);
  }

  @Get(':id')
  getDiplomaById(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.getDiplomaById(id);
  }

  @Post(':id/enroll')
  enroll(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.enroll(id);
  }

  @Get(':id/quizzes')
  getDiplomaQuizzes(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.getDiplomaQuizzes(id);
  }
}
