import { Entity, EntityId } from "@t1fr/backend/ddd-types";
import { Err, Ok } from "ts-results-es";
import { NotFoundOurPositionError } from "./DomainError";
import { Squad } from "./Squad";

type HistoryIdValue = { year: number; seasonIndex: number };

interface HistoryProps {
    top100: Squad[];
    finalPos: number | null;
}

export class HistoryId extends EntityId<HistoryIdValue> {}

export class History extends Entity<HistoryId, HistoryProps> {
    private static readonly t1frSquadId = 1078072;

    static create(id: HistoryId, props: Pick<HistoryProps, "top100">) {
        const findPosOrError = History.searchPos(props.top100);

        return findPosOrError.mapOrElse(
            () => new History(id, { ...props, finalPos: null }),
            pos => new History(id, { ...props, finalPos: pos }),
        );
    }

    static rebuild(id: HistoryId, props: HistoryProps) {
        return Ok(new History(id, props));
    }

    get finalPos(): number | null {
        return this.props.finalPos;
    }

    set finalPos(pos: number) {
        this.props.finalPos = pos;
    }

    static searchPos(squads: Squad[]) {
        const t1fr = squads.find(it => it.props.id === History.t1frSquadId);
        if (!t1fr) return Err(NotFoundOurPositionError.create());
        return Ok(t1fr.props.position);
    }

    get top100() {
        return this.props.top100;
    }
}
