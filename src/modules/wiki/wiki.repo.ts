import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Model } from "mongoose";
import { Vehicle } from "@/modules/wiki/vehicle.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ConnectionName } from "@/constant";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { CountryDictionary, CountryImageDictionary, CountryKey, translateEvent, TypeDictionary, TypeKey } from "@/modules/wiki/dictionary";
import { Cron, CronExpression } from '@nestjs/schedule'

export interface DataResponse {
	version: string;
	army: VehicleJsonSchema[];
	aviation: VehicleJsonSchema[];
	helicopters: VehicleJsonSchema[];
	ship: VehicleJsonSchema[];
	boat: VehicleJsonSchema[];
}

// noinspection SpellCheckingInspection
interface VehicleJsonSchema {
	intname: string;
	displayname?: string;
	wikiname?: string;
	country: CountryKey;
	rank: number;
	br: string[];
	type: TypeKey;
	normal_type: TypeKey;
	extended_type?: TypeKey[];
	obtainFrom?: string;
	cost_gold?: number;
	store?: string;
	operator_country?: CountryKey;
	squad?: boolean;
	marketplace?: string;
	event?: string;
}

@Injectable()
export class WikiRepo implements OnModuleInit {
	constructor(
		@InjectModel(Vehicle.name, ConnectionName.Common) private readonly vehicleModel: Model<Vehicle>,
		private httpService: HttpService,
	) {}

	private static logger = new Logger(WikiRepo.name);

	private static VehicleListUrl = "https://raw.githubusercontent.com/natgo/wt-data/main/data/final.json";
	private static version = "";

	private static generateKeywords(name: string, country: CountryKey, type: TypeKey): string[] {
		const keywords = [name];
		if (country === "country_usa") {
			if (type === "army") {
				const split = name
					.split(" ")
					.map(value => value.replaceAll(/[()]/g, ""))
					.filter(value => value.length > 2);

				const match = split[0].match(/([a-z]+-?(?:\d+|[a-z]))|(LVT)/);
				if (match) keywords.push(...Array.from(match));
				else keywords.push(split[0]);
				keywords.push(...split.slice(1));
			}
		}

		return keywords;
	}

	@Cron(CronExpression.EVERY_WEEK)
	async sync() {
		const response = await lastValueFrom(this.httpService.get<DataResponse>(WikiRepo.VehicleListUrl)).catch(WikiRepo.logger.error);
		if (!response || !response.data) return;
		const data = response.data;
		if (WikiRepo.version === data.version) return;
		WikiRepo.version = data.version;
		data.ship.forEach(value => (value.wikiname = value.displayname));
		data.boat.forEach(value => (value.wikiname = value.displayname));
		const vehicles = [...data.army, ...data.aviation, ...data.boat, ...data.ship, ...data.helicopters];

		await this.vehicleModel.bulkWrite(
			vehicles.map(vehicle => {
				// noinspection SpellCheckingInspection
				const { intname, br, event, country, displayname, wikiname, operator_country, type, normal_type, extended_type, ...other } = vehicle;
				const [arcade, realistic, simulator] = br.map(parseFloat);
				const operator = operator_country ? CountryDictionary[operator_country] : undefined;
				return {
					updateOne: {
						filter: { key: intname },
						update: {
							key: intname,
							name: wikiname,
							br: { arcade, realistic, simulator },
							country: CountryDictionary[country],
							operator,
							event: translateEvent(event),
							type: TypeDictionary[type],
							normal_type: TypeDictionary[normal_type],
							extended_type: extended_type?.map(value => TypeDictionary[value]),
							operatorImageUrl: CountryImageDictionary[operator_country ?? country],
							...other,
						},
						upsert: true,
					},
				};
			}),
		);
	}

	async search(query: string) {
		return this.vehicleModel.find({ $text: { $search: query, $caseSensitive: false } }).limit(25);
	}

	async getByKey(key: string) {
		return this.vehicleModel.findOne({ key });
	}

	async onModuleInit() {
		await this.sync();
	}
}



























































































