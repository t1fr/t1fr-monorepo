import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class OfficerGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        if (!request.user || !request.user.data.isOfficer) throw new ForbiddenException("權限不足");
        return true;
    }
}