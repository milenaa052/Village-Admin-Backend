import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate( context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req?.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if ( String(user.userType).toUpperCase() === 'ADMIN') {
      return true;
    }

    throw new ForbiddenException('Você não possui permissão para esta operação');
  }
}