import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Member } from "@/modules/management/member/member.schema";

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const token = request.cookies.token;
		if (!token) throw new UnauthorizedException();
		try {
			request.user = await this.jwtService.verifyAsync<Member>(token);
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}
}