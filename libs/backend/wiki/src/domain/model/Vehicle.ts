import { ValueObject } from "@t1fr/backend/ddd-types";
import assert from "assert";
import { BattleRating } from "./BattleRating";
import { Country } from "./Country";
import { FlagImageMap } from "./FlagImageMap";
import { ObtainSource } from "./ObtainSource";
import { Type } from "./Type";
import { VehicleClass } from "./VehicleClass";

type VehicleCommonProps = {
    id: string;
    name: string;
    rank: number;
    battleRating: BattleRating;
    country: Country;
    operator: Country;
    type: Type;
    vehicleClasses: VehicleClass[];
    obtainSource: ObtainSource;
}

type VehicleRebuildProps = {
    store?: string;
    event?: string;
    goldPrice?: number;
    marketplace?: string;
} & VehicleCommonProps;


export class Vehicle<Extra extends { obtainSource: ObtainSource } = { obtainSource: ObtainSource }> extends ValueObject<Extra & VehicleCommonProps> {
    static rebuild(props: VehicleRebuildProps) {
        const { obtainSource, store, marketplace, goldPrice, event } = props;
        switch (obtainSource) {
            case ObtainSource.Squad:
            case ObtainSource.Techtree:
                return new NormalVehicle({ ...props, obtainSource });
            case ObtainSource.Gift:
                return new GiftVehicle({ ...props, obtainSource, event });
            case ObtainSource.Store:
                assert(store !== undefined);
                return new StoreVehicle({ ...props, obtainSource, store });
            case ObtainSource.Marketplace:
                assert(marketplace !== undefined);
                return new MarketplaceVehicle({ ...props, obtainSource, marketplace, event });
            case ObtainSource.Gold:
                assert(goldPrice !== undefined);
                return new GoldVehicle({ ...props, obtainSource, goldPrice, event });
        }
    }

    isNormalVehicle(): this is NormalVehicle {
        return this.props.obtainSource === ObtainSource.Squad || this.props.obtainSource === ObtainSource.Techtree;
    }

    isGoldVehicle(): this is GoldVehicle {
        return this.props.obtainSource === ObtainSource.Gold;
    }

    isGiftVehicle(): this is GiftVehicle {
        return this.props.obtainSource === ObtainSource.Gift;
    }

    isMarketplaceVehicle(): this is MarketplaceVehicle {
        return this.props.obtainSource === ObtainSource.Marketplace;
    }

    isStoreVehicle(): this is StoreVehicle {
        return this.props.obtainSource === ObtainSource.Store;
    }

    get wikiUrl() {
        const inferedName = (this.props.name as string) === (this.props.id as string);
        return inferedName ? undefined : `https://wiki.warthunder.com/${encodeURI(this.props.name)}`;
    }

    get thumbnailUrl() {
        return `https://encyclopedia.warthunder.com/i/images/${encodeURI(this.props.id.toLowerCase())}.png`;
    }

    get flagUrl() {
        return FlagImageMap[this.props.operator];
    }
}

type NormalVehicleProps = { obtainSource: typeof ObtainSource.Techtree | typeof ObtainSource.Squad }

class NormalVehicle extends Vehicle<NormalVehicleProps> {
}


type GiftVehicleProps = { obtainSource: typeof ObtainSource.Gift, event: string | undefined }

class GiftVehicle extends Vehicle<GiftVehicleProps> {
}

type GoldVehicleProps = { obtainSource: typeof ObtainSource.Gold, goldPrice: number, event: string | undefined }

class GoldVehicle extends Vehicle<GoldVehicleProps> {
}

type StoreVehicleProps = { obtainSource: typeof ObtainSource.Store, store: string };

class StoreVehicle extends Vehicle<StoreVehicleProps> {
    get storeUrl() {
        return `https://store.gaijin.net/story.php?id=${encodeURI(this.props.store)}`;
    }
}

type MarketplaceVehicleProps = { obtainSource: typeof ObtainSource.Marketplace, marketplace: string, event: string | undefined };

class MarketplaceVehicle extends Vehicle<MarketplaceVehicleProps> {
    get marketplaceUrl() {
        return `https://trade.gaijin.net/?n=${encodeURI(this.props.marketplace ?? "")}&viewitem=&a=1067`;
    }
}


