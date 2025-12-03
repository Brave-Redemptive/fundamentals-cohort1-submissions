export type Result<T, E> =
  | { is: "success"; value: T }
  | { is: "failure"; error: E };

export const ok = <T>(value: T): Result<T, never> => ({
  is: "success",
  value,
});

export const fail = <E>(error: E): Result<never, E> => ({
  is: "failure",
  error,
});