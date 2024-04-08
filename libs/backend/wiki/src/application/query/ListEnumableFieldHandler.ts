import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { VehicleRepo } from "../../domain";
import { ListEnumableField, ListEnumableFieldResult } from "./ListEnumableField";

@QueryHandler(ListEnumableField)
export class ListEnumableFieldHandler implements IQueryHandler<ListEnumableField, ListEnumableFieldResult> {
    @VehicleRepo()
    private readonly vehicleRepo!: VehicleRepo;

    async execute(query: ListEnumableField) {
        const result = await this.vehicleRepo.listEnumField(query.data);
        return result.isOk() ? result.value : [];
    }
}
