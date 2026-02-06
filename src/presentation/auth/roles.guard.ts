import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import type { RequestUser } from "./request-user.type";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // si ok
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as RequestUser | undefined;

    if (!user) throw new ForbiddenException("Missing user (AuthGuard not applied)");

    const ok = requiredRoles.some((r) => user.roles.includes(r));
    if (!ok) throw new ForbiddenException("Insufficient role");

    return true;
  }
}