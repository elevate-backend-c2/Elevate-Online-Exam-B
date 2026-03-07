import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}
  @Post()
  createAdmin() {
    return this.adminService.createAdmin();
  }

  @Patch(':adminId/permissions')
  updateAdminDiplomas(
    @Param('adminId') adminId: string,
    @Body('allowedDiplomas') allowedDiplomas: string[],
  ) {
    return this.adminService.updateAdminDiplomas(adminId, allowedDiplomas);
  }

  @Patch(':adminId/deactivate')
  deactivateAdmin() {
    return this.adminService.deactivateAdmin();
  }
}
