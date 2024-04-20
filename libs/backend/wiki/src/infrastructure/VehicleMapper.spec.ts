import { BattleRating, Country, ObtainSource, Type, Vehicle, VehicleClass } from "../domain";
import { VehicleMapper } from "./VehicleMapper";

describe("測試從 Datamine JSON 轉換為 Vehicle Entity， Happy path", () => {
    it("應為科技樹 techtree 載具", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            obtainSource: ObtainSource.Techtree,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("應為聯隊 squad 載具", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
            squad: true,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            obtainSource: ObtainSource.Squad,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("應為禮品 gift 載具", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
            obtainFrom: ObtainSource.Gift,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            obtainSource: ObtainSource.Gift,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("應為禮品 gift 載具 並具有活動訊息", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
            event: "RANDOM",
            obtainFrom: ObtainSource.Gift,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            event: "RANDOM",
            obtainSource: ObtainSource.Gift,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("應為商城 store 載具", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            obtainFrom: ObtainSource.Store,
            store: "4543",
            br: [3.7, 3.7, 3.7],
            rank: 6,
            squad: true,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            store: "4543",
            obtainSource: ObtainSource.Store,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("應為市場 marketplace 載具", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            obtainFrom: ObtainSource.Marketplace,
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
            marketplace: "4534",
            squad: true,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            marketplace: "4534",
            obtainSource: ObtainSource.Marketplace,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("應為金鷹 gold 載具", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
            cost_gold: 4122,
            obtainFrom: ObtainSource.Gold,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            goldPrice: 4122,
            obtainSource: ObtainSource.Gold,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("當 operator 為空時，用 country 推斷", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            obtainSource: ObtainSource.Techtree,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("br 依照 [AB, RB, SB] 轉換", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            country: Country.GDR,
            br: [6.0, 6.3, 6.7],
            rank: 6,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 6.0, realistic: 6.3, simulator: 6.7 }),
            rank: 6,
            obtainSource: ObtainSource.Techtree,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });

    it("載具類型至少有一個 normal type，並包含數個 extended type", () => {
        const vehicle = VehicleMapper.fromJsonSchema({
            intname: "",
            wikiname: "",
            type: Type.Ship,
            normal_type: VehicleClass.Battleship,
            extended_type: [VehicleClass.AirDefenseFighter],
            country: Country.GDR,
            br: [3.7, 3.7, 3.7],
            rank: 6,
            squad: true,
        });

        const shouldBe = Vehicle.rebuild({
            id: "",
            name: "",
            type: Type.Ship,
            vehicleClasses: [VehicleClass.Battleship, VehicleClass.AirDefenseFighter],
            country: Country.GDR,
            operator: Country.GDR,
            battleRating: BattleRating.rebuild({ arcade: 3.7, simulator: 3.7, realistic: 3.7 }),
            rank: 6,
            obtainSource: ObtainSource.Squad,
        });

        expect(shouldBe.equals(vehicle)).toBeTruthy();
    });
});