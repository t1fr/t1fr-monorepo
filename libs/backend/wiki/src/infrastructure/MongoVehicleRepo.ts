import { Injectable, Provider } from "@nestjs/common";
import { BattleRating, DomainError, FindByNameOptions, Vehicle, VehicleRepo } from "../domain";
import { Err, Ok, Result } from "ts-results-es";
import { castArray } from "lodash";
import { Adapter } from "@t1fr/backend/ddd-types";
import { InjectVehicleModel, VehicleModel, VehicleSchema } from "./VehicleSchema";

@Injectable()
export class MongoVehicleRepo implements VehicleRepo, Adapter<Vehicle, VehicleSchema, DomainError> {

	@InjectVehicleModel()
	private readonly vehicleModel!: VehicleModel;

	async searchByName(name: string, options?: FindByNameOptions | undefined): Promise<Result<Vehicle[], DomainError>> {
		const doc = await this.vehicleModel.find({ $text: { $caseSensitive: false, $search: name } }, {}, { limit: options?.limit }).lean();
		return Ok(doc.map(this.restore)
			.filter((result): result is Ok<Vehicle> => result.isOk())
			.map(result => result.value));
	}

	async findByKey(key: string): Promise<Result<Vehicle, DomainError>> {
		const doc = await this.vehicleModel.findOne({ key }).lean();
		if (!doc) return Err(DomainError.NotFoundVehicle);
		return this.restore(doc);
	}

	async save(data: Vehicle | Vehicle[]): Promise<Result<void, DomainError>> {
		const writeModels = castArray(data)
			.map(this.persist)
			.filter((result): result is Ok<VehicleSchema> => result.isOk())
			.map(result => {
				const { _id, ...other } = result.value;
				return { updateOne: { filter: { _id }, update: other, upsert: true } };
			});
		await this.vehicleModel.bulkWrite(writeModels);
		return Ok.EMPTY;
	}

	persist(model: Vehicle): Result<VehicleSchema, DomainError> {
		const { id, battleRating, ...other } = model.props;
		const baseSchema: VehicleSchema = { _id: id, battleRating: battleRating.props, ...other };
		if (model.isStore()) return Ok({ ...baseSchema, store: model.props.store });
		if (model.isMarketplace()) return Ok({ ...baseSchema, marketplace: model.props.marketplace });
		if (model.isGift()) return Ok({ ...baseSchema, event: model.props.event });
		if (model.isGold()) return Ok({ ...baseSchema, goldPrice: model.props.goldPrice });
		return Ok(baseSchema);
	}

	restore(model: VehicleSchema): Result<Vehicle, DomainError> {
		const { battleRating, _id: id, ...other } = model;
		const battleRatingModel = BattleRating.create(battleRating).value;
		return Vehicle.rebuild({ ...other, id, battleRating: battleRatingModel });
	}


}

export const MongoVehicleRepoProvider: Provider = { provide: VehicleRepo, useClass: MongoVehicleRepo };
