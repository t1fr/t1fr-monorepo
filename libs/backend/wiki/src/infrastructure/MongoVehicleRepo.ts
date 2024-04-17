import { Injectable, Provider } from "@nestjs/common";
import { AppError, DomainError } from "@t1fr/backend/ddd-types";
import { castArray } from "lodash";
import { Err, Ok, Result } from "ts-results-es";
import { BattleRating, EnumFields, FindByNameOptions, FindVehicleByIdError, SearchCriteria, Vehicle, VehicleRepo } from "../domain";
import { InjectVehicleModel, VehicleModel, VehicleSchema } from "./VehicleSchema";

@Injectable()
export class MongoVehicleRepo implements VehicleRepo {

    @InjectVehicleModel()
    private readonly vehicleModel!: VehicleModel;

    async searchByName(name: string, criteria: SearchCriteria, options?: FindByNameOptions | undefined): Promise<Result<Vehicle[], DomainError>> {
        const limit = options?.limit ?? 25;
        const random = name.length === 0;
        const aggregate = this.vehicleModel.aggregate<VehicleSchema>().match({
            $and: [
                criteria.rank ? { rank: criteria.rank } : {},
                criteria.country ? { $or: [{ country: criteria.country }, { operator: criteria.country }] } : {},
                name.length === 0 ? {} : { $text: { $caseSensitive: false, $search: name } },
            ],
        });
        const action = random ? aggregate.sample(limit) : aggregate.limit(limit);
        const docs = await action;
        return Ok(docs.map(this.restore));
    }

    async findById(id: string): Promise<Result<Vehicle, DomainError>> {
        const doc = await this.vehicleModel.findOne({ _id: id }).lean();
        if (!doc) return Err(new FindVehicleByIdError.VehicleNotFoundError(id));
        return Ok(this.restore(doc));
    }

    async save(data: Vehicle | Vehicle[]): Promise<Result<number, DomainError>> {
        const writeModels = castArray(data)
            .map(this.persist)
            .map(result => {
                const { _id, ...other } = result;
                return { updateOne: { filter: { _id }, update: other, upsert: true } };
            });
        try {
            const writeResult = await this.vehicleModel.bulkWrite(writeModels);
            return Ok(writeResult.upsertedCount);
        } catch (e) {
            return Err(new AppError.UnexpectedError(e));
        }
    }

    persist(model: Vehicle): VehicleSchema {
        const { id, battleRating, ...other } = model.props;
        return { _id: id, battleRating: battleRating.props, ...other };
    }

    restore(model: VehicleSchema): Vehicle {
        const { battleRating, _id: id, ...other } = model;
        const battleRatingModel = BattleRating.rebuild(battleRating);
        return Vehicle.rebuild({ ...other, id, battleRating: battleRatingModel });
    }

    async listEnumField(field: EnumFields): Promise<Result<string[], DomainError>> {
        const aggregate = this.vehicleModel.aggregate<{ _id: string }>();
        const options = await (field === "vehicleClasses" ? aggregate.unwind("$vehicleClasses").group({ _id: "$vehicleClasses" }) : aggregate.group({ _id: `$${field}` }));
        return Ok(options.map(it => it._id));
    }
}

export const MongoVehicleRepoProvider: Provider = { provide: VehicleRepo, useClass: MongoVehicleRepo };
