import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import {
  CurrentUser,
  type CurrentUserType,
} from './decorators/current-user.decorator';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}
  @Post()
  createAdmin(
    @Body() dto: CreateAdminDto,
    @CurrentUser() superAdmin: CurrentUserType,
  ) {
    return this.adminService.createAdmin(dto, superAdmin);
  }

  @Patch(':adminId/permissions')
  updateAdminDiplomas(
    @Param('adminId') adminId: string,
    @Body('allowedDiplomas') allowedDiplomas: string[],
    @CurrentUser() superAdmin: CurrentUserType,
  ) {
    return this.adminService.updateAdminDiplomas(
      adminId,
      allowedDiplomas,
      superAdmin,
    );
  }

  @Patch(':adminId/deactivate')
  deactivateAdmin(
    @Param('adminId') adminId: string,
    @CurrentUser() superAdmin: CurrentUserType,
  ) {
    return this.adminService.deactivateAdmin(adminId, superAdmin);
  }

  @Get('audit-logs')
  getSuperAdminAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
