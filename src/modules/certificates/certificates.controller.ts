import { Controller, Get, Param, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { RequestWithUser } from '../auth/types/request-with-user.type';
import type { AuthenticatedUser } from '../admins/types/authenticated-request.type';
import { CertificatesService } from './certificates.service';
import type { PaginatedCertificatesResponse } from './types/paginated-certificates-response.type';

@ApiTags('certificates')
@ApiBearerAuth('access-token')
@Controller({
  path: 'certificates',
  version: '1',
})
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  async getMyCertificates(
    @Req() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedCertificatesResponse> {
    const user = req.user as AuthenticatedUser | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const result = await this.certificatesService.getUserCertificates(
      user.id,
      pageNumber,
      limitNumber,
    );
    return result;
  }

  @Get(':id/pdf')
  async getMyCertificatePdf(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<{ id: string; code: string; pdfBase64: string }> {
    const user = req.user as AuthenticatedUser | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }
    const result = await this.certificatesService.getCertificatePdfForUser(
      id,
      user.id,
    );
    return result;
  }
}
