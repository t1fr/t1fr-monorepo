export type Serialized<T> =
    T extends Date ? string
    : T extends object ? { [U in keyof T]: Serialized<T[U]> } : T;

