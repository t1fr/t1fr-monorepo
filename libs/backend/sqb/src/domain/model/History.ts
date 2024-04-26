import { Entity, EntityId } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { NotFoundOurPositionError } from "./DomainError";
import { Squad } from "./Squad";

type HistoryIdValue = { year: number; seasonIndex: number };

interface HistoryProps {
    top100: Squad[];
    me: Squad | null;
}

export class HistoryId extends EntityId<HistoryIdValue> {
}

export class History extends Entity<HistoryId, HistoryProps> {
    private static readonly t1frSquadId = 1078072;

    static create(id: HistoryId, props: Pick<HistoryProps, "top100">) {
        const findPosOrError = History.searchMe(props.top100);

        return findPosOrError.mapOrElse(
            () => new History(id, { ...props, me: null }),
            me => new History(id, { ...props, me: me }),
        );
    }

    static rebuild(id: HistoryId, props: HistoryProps) {
        return new History(id, props);
    }

    get me(): Squad | null {
        return this.props.me;
    }

    set me(me: Squad) {
        this.props.me = me;
    }

    static searchMe(squads: Squad[]) {
        const t1fr = squads.find(it => it.props.id === History.t1frSquadId);
        if (!t1fr) return Err(NotFoundOurPositionError.create());
        return Ok(t1fr);
    }

    get top100() {
        return this.props.top100;
    }
}
