import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { RequestUser } from "./request-user.type";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const header = req.headers["authorization"];
    if (!header || typeof header !== "string") {
      throw new UnauthorizedException("Missing Authorization header");
    }

    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid Authorization format. Expected: Bearer <token>");
    }

    // TODO : plus tard à remplacer par un appel au microservice Auth
    // ex: token === "admin" -> ADMIN, token === "manager" -> MANAGER, etc.
    const user: RequestUser =
      token === "admin"
        ? { id: "user_admin", roles: ["ADMIN"] }
        : token === "manager"
        ? { id: "user_manager", roles: ["MANAGER"] }
        : { id: "user_user", roles: ["USER"] };

    req.user = user;

    return true;
  }
}