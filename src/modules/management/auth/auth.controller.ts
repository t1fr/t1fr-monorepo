import { Body, Controller, Delete, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "@/modules/management/auth/auth.service";
import { CookieOptions, Response } from "express";
import { JwtGuard } from "@/guards/jwt.guard";
import { User } from "@/decorators/user.decorator";
import { Member } from "@/modules/management/member/member.schema";
import * as process from "process";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	static cookieOptions: CookieOptions = {
		httpOnly: true,
		secure: true,
		domain: process.env["NODE_ENV"] === "test" ? "localhost" : ".web.app",
		path: "/",
		sameSite: "strict",
		maxAge: 1800 * 1000,
	};

	@Post()
	async login(@Body("code") code: string, @Res({ passthrough: true }) response: Response) {
		const { token, data } = await this.authService.login(code);
		response.cookie("token", token, AuthController.cookieOptions);
		return data;
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