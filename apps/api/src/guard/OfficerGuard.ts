import { type ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { SessionGuard } from "./SessionGuard";

@Injectable()
export class OfficerGuard extends SessionGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        return super.canActivate(context) && (request.session?.isOfficer ?? false)
    }
}