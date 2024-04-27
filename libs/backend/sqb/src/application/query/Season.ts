export type Season = {
    year: number;
    seasonIndex: number;
    sections: Array<{
        from: Date;
        to: Date;
        battleRating: number;
    }>;
}