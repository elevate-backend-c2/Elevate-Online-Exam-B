import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { type Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('super-admin')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}
  @Post()
  createAdmin(@Body() dto: CreateAdminDto, @Req() req: Request) {
    return this.adminService.createAdmin(dto, req.user);
  }

  @Patch(':adminId/permissions')
  updateAdminDiplomas(
    @Param('adminId') adminId: string,
    @Body('allowedDiplomas') allowedDiplomas: string[],
    @Req() req: Request,
  ) {
    return this.adminService.updateAdminDiplomas(
      adminId,
      allowedDiplomas,
      req.user,
    );
  }

  @Patch(':adminId/deactivate')
  deactivateAdmin(@Param('adminId') adminId: string, @Req() req: Request) {
    return this.adminService.deactivateAdmin(adminId, req.user);
  }

  @Get('audit-logs')
  getSuperAdminAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
