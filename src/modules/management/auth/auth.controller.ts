import { Controller, Delete, Get, Post, Query, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "@/modules/management/auth/auth.service";
import { CookieOptions, Response } from "express";
import { JwtGuard } from "@/guards/jwt.guard";
import { User } from "@/decorators/user.decorator";
import { Member } from "@/modules/management/member/member.schema";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	static cookieOptions: CookieOptions = { httpOnly: true, secure: true, path: "/", sameSite: "none", maxAge: 1800 * 1000, domain: AuthService.Host };

	@Get("redirect")
	async redirect(@Query("code") code: string, @Query("state") state: string, @Res({ passthrough: true }) response: Response) {
		const redirect = decodeURIComponent(state);
		if (code) response.cookie("token", await this.authService.login(code), AuthController.cookieOptions);
		response.redirect(redirect);
	}

	@UseGuards(JwtGuard)
	@Post("verify")
	async verify(@User() user: Member) {
		return user;
	}

	@Delete()
	async logout(@Res({ passthrough: true }) response: Response) {
		response.cookie("token", "", { ...AuthController.cookieOptions, maxAge: 0 });
	}
}