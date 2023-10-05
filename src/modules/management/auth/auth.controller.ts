import { Controller, Delete, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "@/modules/management/auth/auth.service";
import { CookieOptions, Request, Response } from "express";
import { JwtGuard } from "@/guards/jwt.guard";
import { User } from "@/decorators/user.decorator";
import { Member } from "@/modules/management/member/member.schema";
import * as process from "process";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	static cookieOptions: CookieOptions = {
		httpOnly: true,
		secure: true,
		path: "/",
		sameSite: "none",
		maxAge: 1800 * 1000,
	};

	@Get("redirect")
	async redirect(@Query("code") code: string, @Query("state") state: string, @Res({ passthrough: true }) response: Response) {
		const redirect = decodeURIComponent(state);
		if (code) {
			const token = await this.authService.login(code);
			response.cookie("token", token, {...AuthController.cookieOptions, domain: new URL(redirect).hostname});
		}
		response.redirect(redirect);
	}

	@UseGuards(JwtGuard)
	@Post("verify")
	async verify(@User() user: Member) {
		return user;
	}

	@Delete()
	async logout(@Res({ passthrough: true }) response: Response) {
		response.cookie("token", "", { maxAge: 0 });
	}
}