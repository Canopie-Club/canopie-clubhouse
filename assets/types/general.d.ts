type SerializeObject<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends object
    ? SerializeObject<T[K]>
    : T[K];
};