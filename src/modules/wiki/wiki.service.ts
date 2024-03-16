import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { Vehicle } from "@/modules/wiki/vehicle.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ConnectionName } from "@/constant";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { CountryDictionary, CountryImageDictionary, CountryKey, translateEvent, TypeDictionary, TypeKey } from "@/modules/wiki/dictionary";
import { Cron, CronExpression } from "@nestjs/schedule";

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
export class WikiService {
	constructor(
		@InjectModel(Vehicle.name, ConnectionName.Common) private readonly vehicleModel: Model<Vehicle>,
		private httpService: HttpService,
	) {
	}

	private static logger = new Logger(WikiService.name);

	private static VehicleListUrl = "https://raw.githubusercontent.com/natgo/wt-data/main/data/final.json";
	private static version = "";

	@Cron(CronExpression.EVERY_WEEK)
	async sync() {
		const response = await lastValueFrom(this.httpService.get<DataResponse>(WikiService.VehicleListUrl)).catch(WikiService.logger.error);
		if (!response || !response.data) return;
		const data = response.data;
		if (WikiService.version === data.version) return;
		WikiService.version = data.version;
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
		if (query) return this.vehicleModel.find({ $text: { $search: query, $caseSensitive: false } }).limit(25);
		else return this.vehicleModel.aggregate([{ $sample: { size: 25 } }]);
	}

	async getByKey(key: string) {
		return this.vehicleModel.findOne({ key });
	}
}



























































































