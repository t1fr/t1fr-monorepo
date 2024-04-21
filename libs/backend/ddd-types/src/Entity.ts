import { EntityId } from "./EntityId";

export abstract class Entity<Id extends EntityId<unknown>, Props extends object> {
	readonly id: Id;
	protected props: Props;

	protected constructor(id: Id, props: Props) {
		this.id = id;
		this.props = props;
	}

	equals(obj?: Entity<Id, Props>): boolean {
		const isEntity = (v: unknown): v is Entity<Id, Props> => v instanceof Entity;

		if (obj == null) return false;
		if (!isEntity(obj)) return false;
		return this.id.equals(obj.id);
	}
}

