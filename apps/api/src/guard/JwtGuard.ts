import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { User, UserPayload } from "../types";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies.token;

        if (!token) throw new UnauthorizedException();

        this.jwtService
            .verifyAsync<UserPayload>(token)
            .then(payload => {
                request.user = new User(payload);
            })
            .catch(reason => {
                throw new UnauthorizedException(reason);
            });

        return true;
    }
}
