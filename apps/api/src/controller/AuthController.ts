import { Body, Controller, Delete, Headers, Inject, Post, Req, Session } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "../service";

@Controller("auth")
export class AuthController {

    @Inject()
    private readonly authService!: AuthService;

    @Post("login")
    async login(@Session() session: CookieSessionInterfaces.CookieSessionObject, @Headers("referer") referer: string, @Body("code") code: string | undefined) {
        const user = await this.authService.login(referer, code);
        session.id = user.id;
        session.isOfficer = user.isOfficer;
    }

    @Delete()
    async logout(@Req() request: Request) {
        request.session = null;
    }
}
