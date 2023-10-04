import { Injectable, UnauthorizedException } from "@nestjs/common";
import { MemberService } from "@/modules/management/member/member.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { Snowflake } from "discord.js";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly memberService: MemberService,
		private readonly httpService: HttpService,
		private readonly jwtService: JwtService,
	) {}

	async login(code: string) {
		const token = await this.getToken(code);
		if (!token) throw new UnauthorizedException("無效的授權");
		const id = await this.getUserId(token);
		const member = await this.memberService.findMemberById(id);
		if (!member) throw new UnauthorizedException("非聯隊成員");
		return { token: this.jwtService.sign(member.toObject()), data: member };
	}

	private async getToken(code: string) {
		const data = {
			client_id: "1013280626000003132",
			client_secret: "l6l-mpiqLQjhIbukQjiW7zitAq3Xxbme",
			grant_type: "authorization_code",
			code,
			redirect_uri: "http://localhost:5173/redirect",
		};

		const observable = this.httpService.post<{ access_token?: string }>("https://discord.com/api/oauth2/token", data, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		const response = await lastValueFrom(observable);
		return response.data.access_token;
	}

	private async getUserId(token: string) {
		const observable = this.httpService.get<{ id: Snowflake }>("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${token}` } });
		const response = await lastValueFrom(observable);
		return response.data.id;
	}
}