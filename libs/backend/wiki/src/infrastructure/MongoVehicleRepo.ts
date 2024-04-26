import { Injectable, Provider } from "@nestjs/common";
import { AsyncActionResult } from "@t1fr/backend/ddd-types";
import { castArray } from "lodash";
import { AsyncResult, Err, Ok } from "ts-results-es";
import { BattleRating, EnumField, FindByNameOptions, FindVehicleByIdError, SearchCriteria, Vehicle, VehicleRepo } from "../domain";
import { InjectVehicleModel, VehicleModel, VehicleSchema } from "./VehicleSchema";

@Injectable()
export class MongoVehicleRepo implements VehicleRepo {

    @InjectVehicleModel()
    private readonly vehicleModel!: VehicleModel;


    searchByName(criteria: SearchCriteria, options?: FindByNameOptions): AsyncActionResult<Vehicle[]> {
        const limit = options?.limit ?? 25;
        const random = criteria.name.length === 0;

        const sanitizeSearchCriteria = (criteria: SearchCriteria) => {
            const filter = [];
            if (criteria.rank) filter.push({ rank: criteria.rank });
            if (criteria.country) filter.push({ $or: [{ country: criteria.country }, { operator: criteria.country }] });
            if (criteria.name.length !== 0) filter.push({ $text: { $caseSensitive: false, $search: criteria.name } });
            return filter.length ? { $and: filter } : {};
        };

        const aggregate = this.vehicleModel.aggregate<VehicleSchema>().match(sanitizeSearchCriteria(criteria));
        const action = random ? aggregate.sample(limit) : aggregate.limit(limit);

        return new AsyncResult(action.then(docs => Ok(docs.map(this.restore))));
    }

    findById(id: string): AsyncActionResult<Vehicle> {
        const promise = this.vehicleModel.findOne({ _id: id })
            .lean()
            .then(doc => {
                if (!doc) return Err(new FindVehicleByIdError.VehicleNotFoundError(id));
                return Ok(this.restore(doc));
            });

        return new AsyncResult(promise);
    }

    save(data: Vehicle | Vehicle[]): AsyncActionResult<number> {
        const writeModels = castArray(data)
            .map(it => this.persist(it))
            .map(result => {
                const { _id, ...other } = result;
                return { updateOne: { filter: { _id }, update: other, upsert: true } };
            });
        const promise = this.vehicleModel.bulkWrite(writeModels)
            .then(result => Ok(result.matchedCount));

        return new AsyncResult(promise);
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

    listEnumField(field: EnumField): AsyncActionResult<string[]> {
        const aggregate = this.vehicleModel.aggregate<{ _id: string }>();
        const group = field === "class"
            ? aggregate.unwind("$vehicleClasses").group({ _id: "$vehicleClasses" })
            : aggregate.group({ _id: `$${field}` });

        const promise = group.then(options => Ok(options.map(it => it._id)));

        return new AsyncResult(promise);
    }
}

export const MongoVehicleRepoProvider: Provider = { provide: VehicleRepo, useClass: MongoVehicleRepo };
