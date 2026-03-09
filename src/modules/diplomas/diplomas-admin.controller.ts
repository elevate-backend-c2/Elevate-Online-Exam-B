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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiplomasService } from './diplomas.service';
import { CreateDiplomaDto } from './dto/create-diploma.dto';
import { UpdateDiplomaDto } from './dto/update-diploma.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { DiplomaAccess } from '../auth/decorators/diploma-access.decorator';

@ApiTags('diplomas-admin')
@ApiBearerAuth('access-token')
@Controller({
  path: 'admin/diplomas',
  version: '1',
})
export class DiplomasAdminController {
  constructor(private readonly diplomasService: DiplomasService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  createDiploma(@Body() dto: CreateDiplomaDto) {
    return this.diplomasService.createDiploma(dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @DiplomaAccess({ source: 'param', key: 'id' })
  @Patch(':id')
  updateDiploma(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateDiplomaDto,
  ) {
    return this.diplomasService.updateDiploma(id, dto);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteDiploma(@Param('id', ParseObjectIdPipe) id: string) {
    return this.diplomasService.deleteDiploma(id);
  }
}
