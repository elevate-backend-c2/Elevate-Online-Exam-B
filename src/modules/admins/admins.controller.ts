import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import type { AuthenticatedRequest } from './types/authenticated-request.type';
import type {
  AdminSimpleResponse,
  PaginatedAdminsResponse,
} from './types/admin-responses.type';
import type { SuperAdminAuditLog } from './schemas/admins-audit-logs.schema';
import type { PaginationDto } from '../users/dto/pagination.dto';

@ApiTags('admins')
@ApiBearerAuth('access-token')
@Controller({
  path: 'admins',
  version: '1',
})
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  createAdmin(
    @Body() dto: CreateAdminDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<AdminSimpleResponse> {
    return this.adminService.createAdmin(dto, req.user);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':adminId/permissions')
  updateAdminDiplomas(
    @Param('adminId') adminId: string,
    @Body('allowedDiplomas') allowedDiplomas: string[],
    @Req() req: AuthenticatedRequest,
  ): Promise<AdminSimpleResponse> {
    return this.adminService.updateAdminDiplomas(
      adminId,
      allowedDiplomas,
      req.user,
    );
  }

  @Roles(UserRole.ADMIN)
  @Patch(':adminId/deactivate')
  deactivateAdmin(
    @Param('adminId') adminId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<AdminSimpleResponse> {
    return this.adminService.deactivateAdmin(adminId, req.user);
  }

  @Roles(UserRole.ADMIN)
  @Get('audit-logs')
  getSuperAdminAuditLogs(): Promise<SuperAdminAuditLog[]> {
    return this.adminService.getAuditLogs();
  }

  @Roles(UserRole.ADMIN)
  @Get()
  getAdmins(@Query() pagination: PaginationDto): Promise<PaginatedAdminsResponse> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    return this.adminService.getAdmins(page, limit);
  }

  @Roles(UserRole.ADMIN)
  @Get('diplomas/:diplomaId')
  getAdminsByDiploma(
    @Param('diplomaId') diplomaId: string,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedAdminsResponse> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    return this.adminService.getAdminsByDiploma(diplomaId, page, limit);
  }
}
