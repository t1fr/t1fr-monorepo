import { Injectable, Provider } from "@nestjs/common";
import { Adapter } from "@t1fr/backend/ddd-types";
import * as console from "console";
import { castArray } from "lodash";
import { Err, Ok, Result } from "ts-results-es";
import { BattleRating, DomainError, EnumFields, FindByNameOptions, SearchCriteria, Vehicle, VehicleRepo } from "../domain";
import { InjectVehicleModel, VehicleModel, VehicleSchema } from "./VehicleSchema";

@Injectable()
export class MongoVehicleRepo implements VehicleRepo, Adapter<Vehicle, VehicleSchema, DomainError> {

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
    return Ok(docs.map(this.restore)
      .filter((result): result is Ok<Vehicle> => result.isOk())
      .map(result => result.value));
  }

  async findById(id: string): Promise<Result<Vehicle, DomainError>> {
    const doc = await this.vehicleModel.findOne({ _id: id }).lean();
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
    await this.vehicleModel.bulkWrite(writeModels).catch(console.error);
    return Ok.EMPTY;
  }

  persist(model: Vehicle): Result<VehicleSchema, DomainError> {
    const { id, battleRating, ...other } = model.props;
    return Ok({ _id: id, battleRating: battleRating.props, ...other });
  }

  restore(model: VehicleSchema): Result<Vehicle, DomainError> {
    const { battleRating, _id: id, ...other } = model;
    const battleRatingModel = BattleRating.create(battleRating).value;
    return Vehicle.create({ ...other, id, battleRating: battleRatingModel });
  }

  async listEnumField(field: EnumFields): Promise<Result<string[], DomainError>> {
    const aggregate = this.vehicleModel.aggregate<{ _id: string }>();
    const options = await (field === "vehicleClasses" ? aggregate.unwind("$vehicleClasses").group({ _id: "$vehicleClasses" }) : aggregate.group({ _id: `$${field}` }));
    return Ok(options.map(it => it._id));
  }
}

export const MongoVehicleRepoProvider: Provider = { provide: VehicleRepo, useClass: MongoVehicleRepo };
