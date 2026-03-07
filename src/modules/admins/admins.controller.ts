import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}
  @Post()
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @Patch(':adminId/permissions')
  updateAdminDiplomas(
    @Param('adminId') adminId: string,
    @Body('allowedDiplomas') allowedDiplomas: string[],
  ) {
    return this.adminService.updateAdminDiplomas(adminId, allowedDiplomas);
  }

  @Patch(':adminId/deactivate')
  deactivateAdmin(@Param('adminId') adminId: string) {
    return this.adminService.deactivateAdmin(adminId);
  }
}
