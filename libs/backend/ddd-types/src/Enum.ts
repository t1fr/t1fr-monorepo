export type Enum<Value extends Readonly<Record<string, string>>> = Value[keyof Value]

export function isEnum<Value extends Readonly<Record<string, string>>>(enumValue: Value): (value: string) => value is Enum<Value> {
    return (value: string): value is Enum<Value> => Object.values(enumValue).includes(value);
}
