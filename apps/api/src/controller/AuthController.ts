import { Body, Controller, Delete, Headers, Inject, Post, Res, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Configuration } from "@t1fr/backend/configs";
import { CookieOptions, Response } from "express";
import { UserToken } from "../decorator";
import { JwtGuard } from "../guard";
import { AuthService } from "../service";
import { User } from "../types";

@Controller("auth")
export class AuthController {
    @Inject()
    private readonly jwtService!: JwtService;

    @Inject()
    private readonly authService!: AuthService;

    @Configuration("app.cookie")
    private readonly cookieOptions!: CookieOptions;

    @Post("login")
    async login(@Res({ passthrough: true }) response: Response, @Headers("referer") referer: string, @Body("code") code: string | undefined) {
        const user = await this.authService.login(referer, code);
        const token = await this.jwtService.signAsync(user.data);
        response.cookie("token", token, this.cookieOptions);
        return user.data;
    }

    @UseGuards(JwtGuard)
    @Post("verify")
    async verify(@UserToken() user: User) {
        return user.data;
    }

    @Delete()
    async logout(@Res({ passthrough: true }) response: Response) {
        response.cookie("token", "", { ...this.cookieOptions, maxAge: 0 });
    }
}
