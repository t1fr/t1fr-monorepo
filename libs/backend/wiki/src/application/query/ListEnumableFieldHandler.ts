import { type IInferredQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { VehicleRepo } from "../../domain";
import { ListEnumableField } from "./ListEnumableField";

@QueryHandler(ListEnumableField)
export class ListEnumableFieldHandler implements IInferredQueryHandler<ListEnumableField> {
    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    async execute(query: ListEnumableField) {
        return query.parse()
            .toAsyncResult()
            .andThen(field => this.vehicleRepo.listEnumField(field))
            .promise;
    }
}
