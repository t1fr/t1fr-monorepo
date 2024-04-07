import { Controller, Delete, Get, Post, Query, Res, UseGuards } from "@nestjs/common";
import { CookieOptions, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./guards";
import { User } from "./decorators";
import { Member } from "@t1fr/legacy/management";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	static cookieOptions: CookieOptions = { httpOnly: true, path: "/", sameSite: "strict", maxAge: 1800 * 1000 };

	@Get("redirect")
	async redirect(@Res({ passthrough: true }) response: Response, @Query("code") code?: string, @Query("state") state?: string) {
		const redirect = state ? Buffer.from(state, "base64").toString("ascii") : "/";
		const isLocalhost = new URL(redirect).hostname === "localhost";
		try {
			const token = await this.authService.login(isLocalhost, code);
			response.cookie("token", token, { ...AuthController.cookieOptions, domain: isLocalhost ? "localhost" : "t1fr.club" });
			response.redirect(redirect);
		} catch (error) {
			response.redirect(`${redirect}?error=${error.message}`);
		}
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
