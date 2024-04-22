export type Undefinedable<T, K extends keyof T> = Required<Omit<T, K>> & { [P in keyof Pick<T, K>]: T[P] | undefined }
