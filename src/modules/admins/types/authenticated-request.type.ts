import type { Request as ExpressRequest } from 'express';
import { UserRole } from '../../auth/enums/user-role.enum';

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  allowedDiplomas?: string[];
}

export interface AuthenticatedRequest extends ExpressRequest {
  user: AuthenticatedUser;
}

