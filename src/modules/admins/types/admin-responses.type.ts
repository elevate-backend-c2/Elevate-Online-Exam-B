export interface AdminSimpleResponse {
  status: string;
  message: string;
}

export interface AdminListItem {
  id: string;
  name: string;
  email: string;
  active: boolean;
  allowedDiplomas: string[];
}

export interface PaginatedAdminsResponse {
  items: AdminListItem[];
  page: number;
  limit: number;
  total: number;
}

