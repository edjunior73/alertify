export interface Obj {
  [key: string]: any
}

export type AnyFunction = (...args: any[]) => any

export type RemoveNeverProperties<T> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends never ? K : never
  }[keyof T]
>

export type RequiredNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type MakeOptionalWithPrefix<T, K extends string, U extends string = K | `_${K}`> = Omit<
  T,
  U
> &
  Partial<Pick<T, Extract<keyof T, U>>>

export type $Values<T extends Obj> = T[keyof T]

export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

export type PrimitiveKeys<T> = keyof PickByValue<T, string>

export type RequiredKeys<T> = {
  [K in keyof T]-?: Obj extends Pick<T, K> ? never : K
}[keyof T]

export type RemoveNullKeys<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export type RemoveSomeUndefined<T, K extends keyof T> = RemoveNullKeys<Pick<T, K>> & Omit<T, K>

export type MakeAllUndefined<T> = {
  [K in keyof T]: T[K] | undefined
}

export type NonNullKeys<T> = RemoveSomeUndefined<MakeAllUndefined<Required<T>>, RequiredKeys<T>>

export type PascalCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${Capitalize<Lowercase<First>>}${PascalCase<Capitalize<Lowercase<Rest>>>}`
  : Capitalize<Lowercase<S>>
