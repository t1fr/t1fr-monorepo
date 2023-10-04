import { Injectable, UnauthorizedException } from "@nestjs/common";
import { MemberService } from "@/modules/management/member/member.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { Snowflake } from "discord.js";
import { JwtService } from "@nestjs/jwt";
import * as process from "process";

@Injectable()
export class AuthService {

	constructor(
		private readonly memberService: MemberService,
		private readonly httpService: HttpService,
		private readonly jwtService: JwtService,
	) {
	}

	async login(code: string) {
		const token = await this.getToken(code);
		if (!token) throw new UnauthorizedException("無效的授權");
		const id = await this.getUserId(token);
		const member = await this.memberService.findMemberById(id);
		if (!member) throw new UnauthorizedException("非聯隊成員");
		return this.jwtService.sign(member.toObject());
	}

	private async getToken(code: string) {
		const host = process.env["NODE_ENV"] === "test" ? "localhost" : "220.133.81.52";
		const data = { grant_type: "authorization_code", code, redirect_uri: `http://${host}:6518/api/auth/redirect` };
		try {
			const response = await this.httpService.axiosRef.post<{ access_token?: string }>("https://discord.com/api/v10/oauth2/token", data, {
				auth: { username: "1013280626000003132", password: "l6l-mpiqLQjhIbukQjiW7zitAq3Xxbme" },
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});
			return response.data.access_token;
		} catch (e) {
			console.error(e);
		}
	}

	private async getUserId(token: string) {
		const observable = this.httpService.get<{ id: Snowflake }>("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${token}` } });
		const response = await lastValueFrom(observable);
		return response.data.id;
	}
}