import { Request } from '@nestjs/common';
import { AuthenticatedUser } from './jwt-payload.interface';

export interface AuthRequest extends Request {
    user: AuthenticatedUser;
}