import type { Request } from 'express';
import type { AuthenticatedUser } from '../../admins/types/authenticated-request.type';

export type RequestWithUser = Request & { user?: AuthenticatedUser };

