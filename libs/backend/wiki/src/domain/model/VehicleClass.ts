export const ArmyClass = {
	MediumTank: "type_medium_tank",
} as const;
export type ArmyClass = typeof ArmyClass[keyof typeof ArmyClass];

export const ShipClass = {
	Battleship: "type_battleship",
} as const;
export type ShipClass = typeof ShipClass[keyof typeof ShipClass];

export const BoatClass = {} as const;
export type BoatClass = typeof BoatClass[keyof typeof BoatClass];

export const HeliClass = {} as const;
export type HeliClass = typeof HeliClass[keyof typeof HeliClass];

export const AircraftClass = {} as const;
export type AircraftClass = typeof AircraftClass[keyof typeof AircraftClass];

export type VehicleClass = ArmyClass | AircraftClass | ShipClass | BoatClass | HeliClass