import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import dayjs from "dayjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class GithubService {
	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
	) {}

	private get timestamp() {
		return dayjs().format("YYYY-MM-DD HH:mm");
	}

	private get token() {
		return this.configService.get("ACCESS_TOKEN");
	}

	async upsertFile(filename: string, content: string) {
		const data = Buffer.from(content).toString("base64");
		const url = `https://api.github.com/repos/t1fr/data-backup/contents/${filename}`;
		const headers = { Accept: "application/vnd.github+json", Authorization: `Bearer ${this.token}` };
		let sha = undefined;
		const getResult = await this.httpService.axiosRef.get<{ sha: string }>(url, { headers }).catch(console.error);
		if (getResult) sha = getResult.data.sha;
		await this.httpService.axiosRef.put(url, { message: this.timestamp, content: data, sha }, { headers }).catch(console.error);
	}
}