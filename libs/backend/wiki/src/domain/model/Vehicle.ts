import { ValueObject } from "@t1fr/backend/ddd-types";
import { BattleRating } from "./BattleRating";
import { Country, FlagDictionary } from "./Country";
import { Type } from "./Type";
import { ObtainSource } from "./ObtainSource";
import { Err, Ok, Result } from "ts-results-es";
import { VehicleClass } from "./VehicleClass";
import { DomainError } from "../DomainError";

type CommonVehicleProps = {
	id: string;
	name: string;
	rank: number;
	battleRating: BattleRating;
	country: Country;
	operator: Country;
	type: Type;
	vehicleClasses: VehicleClass[];
}

type RebuildVehicleProps = CommonVehicleProps & {
	obtainSource: ObtainSource;
	store?: string;
	event?: string;
	goldPrice?: number;
	marketplace?: string;
}

type TechTreeVehicleProps = CommonVehicleProps & {
	obtainSource: typeof ObtainSource.Techtree;
}

type SquadVehicleProps = CommonVehicleProps & {
	obtainSource: typeof ObtainSource.Squad;
}

type StoreVehicleProps = CommonVehicleProps & {
	obtainSource: typeof ObtainSource.Store;
	store: string;
}

type GiftVehicleProps = CommonVehicleProps & {
	obtainSource: typeof ObtainSource.Gift;
	event?: string;
}

type GoldVehicleProps = CommonVehicleProps & {
	obtainSource: typeof ObtainSource.Gold;
	goldPrice: number;
}

type MarketplaceVehicleProps = CommonVehicleProps & {
	obtainSource: typeof ObtainSource.Marketplace;
	event?: string;
	marketplace: string;
}

type VehicleObtainProps = TechTreeVehicleProps | SquadVehicleProps | GoldVehicleProps | GiftVehicleProps | StoreVehicleProps | MarketplaceVehicleProps;

export class Vehicle<T extends VehicleObtainProps = VehicleObtainProps> extends ValueObject<T> {
	static create(props: VehicleObtainProps) {
		return Ok(new Vehicle(props));
	}

	static rebuild(props: RebuildVehicleProps): Result<Vehicle, DomainError> {
		const { obtainSource, store, event, goldPrice, marketplace, ...other } = props;
		switch (obtainSource) {
			case ObtainSource.Marketplace:
				return Ok(new Vehicle({ ...other, obtainSource, marketplace: marketplace!, event }));
			case ObtainSource.Gift:
				return Ok(new Vehicle({ ...other, obtainSource, event }));
			case ObtainSource.Store:
				return Ok(new Vehicle({ ...other, obtainSource, store: store! }));
			case ObtainSource.Gold:
				return Ok(new Vehicle({ ...other, obtainSource, goldPrice: goldPrice! }));
			case ObtainSource.Squad:
			case ObtainSource.Techtree:
				return Ok(new Vehicle({ ...other, obtainSource }));
			default:
				return Err(DomainError.UnknownVehicleObtainWay);
		}
	}

	private get obtainSource() {
		return this.props.obtainSource;
	}

	get wikiUrl() {
		return `https://wiki.warthunder.com/${encodeURI(this.props.name)}`;
	}

	get imageUrl() {
		return FlagDictionary[this.props.operator];
	}

	isStore(): this is StoreVehicle {
		return this.obtainSource === ObtainSource.Store;
	}

	isMarketplace(): this is MarketplaceVehicle {
		return this.obtainSource === ObtainSource.Marketplace;
	}

	isGold(): this is Vehicle<GoldVehicleProps> {
		return this.obtainSource === ObtainSource.Gold;
	}

	isGift(): this is Vehicle<GiftVehicleProps> {
		return this.obtainSource === ObtainSource.Gift;
	}

	isSquad(): this is Vehicle<SquadVehicleProps> {
		return this.obtainSource === ObtainSource.Squad;
	}

	isTechTree(): this is Vehicle<TechTreeVehicleProps> {
		return this.obtainSource === ObtainSource.Techtree;
	}
}

export class StoreVehicle extends Vehicle<StoreVehicleProps> {
	get storeUrl() {
		return `https://store.gaijin.net/story.php?id=${this.props.store}`;
	}
}

export class MarketplaceVehicle extends Vehicle<MarketplaceVehicleProps> {
	get marketplaceUrl() {
		return `https://trade.gaijin.net/?n=${this.props.marketplace}&viewitem=&a=1067`;
	}
}
