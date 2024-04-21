import { AggregateRoot as NestAggregateRoot } from "@nestjs/cqrs";
import { Entity } from "./Entity";
import { EntityId } from "./EntityId";

export abstract class AggregateRoot<Id extends EntityId<unknown>, Props extends object> extends NestAggregateRoot {
    readonly id: Id;
    protected props: Props;

    protected constructor(id: Id, props: Props) {
        super();
        this.id = id;
        this.props = props;
    }

    equals(obj?: Entity<Id, Props>): boolean {
        if (obj == null) return false;
        const isEntity = (v: unknown): v is Entity<Id, Props> => v instanceof Entity;
        if (!isEntity(obj)) return false;
        return this.id.equals(obj.id);
    }
}