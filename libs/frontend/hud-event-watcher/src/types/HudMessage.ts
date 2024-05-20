export interface DamageEvent {
    id: number;
    time: number;
    msg: string;
}

export interface HudMessage {
    damage: DamageEvent[];
}
