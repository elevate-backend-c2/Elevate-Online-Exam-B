import { Controller, Get, Patch, Body, Req, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import type { PaginationDto } from './dto/pagination.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('api/v1/users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: Request) {
    const user: any = (req as any).user;
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const user: any = (req as any).user;
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('deactivate')
  deactivateAccount(@Req() req: Request) {
    const user: any = (req as any).user;
    return this.usersService.deactivateAccount(user.id);
  }

  @Get('statistics')
  getStatistics(@Req() req: Request) {
    const user: any = (req as any).user;
    return this.usersService.getStatistics(user.id);
  }

  @Get('exams')
  getExamHistory(@Req() req: Request, @Query() pagination: PaginationDto) {
    const user: any = (req as any).user;
    return this.usersService.getExamHistory(user.id, pagination);
  }

  @Get('certificates')
  getCertificates(@Req() req: Request, @Query() pagination: PaginationDto) {
    const user: any = (req as any).user;
    return this.usersService.getCertificates(user.id, pagination);
  }
}
