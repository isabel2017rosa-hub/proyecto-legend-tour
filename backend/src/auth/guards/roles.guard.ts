import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Determina si la petición puede continuar según los roles requeridos
  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles configurados con el decorador @Roles() en el handler actual
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // Si no se especificaron roles, se permite el acceso
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Si no hay usuario en la request (no autenticado), se deniega
    if (!user) return false;

    // Verificación simple: si se requiere el rol 'admin' validamos que user.isAdmin sea true
    if (roles.includes('admin')) {
      return !!user.isAdmin;
    }

    // Para otros roles personalizados se podría ampliar la lógica aquí
    return true;
  }
}
