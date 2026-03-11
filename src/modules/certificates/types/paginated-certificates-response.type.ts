import type { CertificateListItem } from './certificate-list-item.type';

export interface PaginatedCertificatesResponse {
  items: CertificateListItem[];
  page: number;
  limit: number;
  total: number;
}

