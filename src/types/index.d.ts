declare global {
  type StringToBigInt<T> = {
    [K in keyof T]: T[K] extends string 
      ? T[K] extends `${infer _}Id` 
        ? bigint 
        : T[K]
      : T[K] extends string | undefined
        ? T[K] extends `${infer _}Id`
          ? bigint | undefined
          : T[K]
        : T[K]
  }
}