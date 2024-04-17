import { ValueObject } from "@t1fr/backend/ddd-types";
import { Ok } from "ts-results-es";
import { BattleRating } from "./BattleRating";
import { Country } from "./Country";
import { FlagImageMap } from "./FlagImageMap";
import { ObtainSource } from "./ObtainSource";
import { Type } from "./Type";
import { VehicleClass } from "./VehicleClass";

type VehicleProps = {
    id: string;
    name: string;
    rank: number;
    battleRating: BattleRating;
    country: Country;
    operator: Country;
    type: Type;
    vehicleClasses: VehicleClass[];
    obtainSource: ObtainSource;
    store?: string;
    event?: string;
    goldPrice?: number;
    marketplace?: string;
}


export class Vehicle extends ValueObject<VehicleProps> {
    static create(props: VehicleProps) {
        return Ok(new Vehicle(props));
    }

    static rebuild(props: VehicleProps) {
        return new Vehicle(props);
    }

    get wikiUrl() {
        return `https://wiki.warthunder.com/${encodeURI(this.props.name)}`;
    }

    get thumbnailUrl() {
        return `https://encyclopedia.warthunder.com/i/images/${encodeURI(this.props.id.toLowerCase())}.png`;
    }

    get flagUrl() {
        return FlagImageMap[this.props.operator];
    }

    get storeUrl() {
        return this.props.obtainSource === ObtainSource.Store ? `https://store.gaijin.net/story.php?id=${encodeURI(this.props.store ?? "")}` : undefined;
    }

    get marketplaceUrl() {
        return this.props.obtainSource === ObtainSource.Marketplace ? `https://trade.gaijin.net/?n=${encodeURI(this.props.marketplace ?? "")}&viewitem=&a=1067` : undefined;
    }
}


