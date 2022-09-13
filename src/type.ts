export type Item = {
  label: string
  value: string
}

export type WithNonNullable<T> = {
  [P in keyof T]: T[P] | null
}
