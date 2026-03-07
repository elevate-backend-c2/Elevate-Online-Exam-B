import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { DiplomasService } from 'src/modules/diplomas/diplomas.service';
import { CreateDiplomaDto } from 'src/modules/diplomas/dto/create-diploma.dto';
import { UpdateDiplomaDto } from 'src/modules/diplomas/dto/update-diploma.dto';

@Controller('admin/diplomas')
export class DiplomasAdminController {
  constructor(private readonly diplomasService: DiplomasService) {}

  @Post()
  createDiploma(@Body() dto: CreateDiplomaDto) {
    return this.diplomasService.createDiploma(dto);
  }

  @Patch(':id')
  updateDiploma(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateDiplomaDto,
  ) {
    return this.diplomasService.updateDiploma(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteDiploma(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.deleteDiploma(id);
  }
}
