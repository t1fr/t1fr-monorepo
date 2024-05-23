export class Player {
    public constructor(
        readonly id: string,
        readonly squadron: string | null,
        readonly vehicle: string
    ) {
    }
}