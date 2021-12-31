export function string(
  value: any,
  errorMessage: string
): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(errorMessage);
  }
}
export function number(
  value: any,
  errorMessage: string
): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error(errorMessage);
  }
}
export function stringOrNumber(
  value: any,
  errorMessage: string
): asserts value is string | number {
  if (!(typeof value === 'string' || typeof value === 'number')) {
    throw new Error(errorMessage);
  }
}
export function notNaN(value: any, errorMessage: string): void {
  if (isNaN(value)) {
    throw new Error(errorMessage);
  }
}
export function notempty(value: string, errorMessage: string): void {
  if (value.length < 1) {
    throw new Error(errorMessage);
  }
}

export function oneof<T extends readonly string[]>(
  value: string,
  oneof: T,
  errorMessage: string
): asserts value is typeof oneof[number] {
  if (!oneof.includes(value)) {
    throw new Error(errorMessage);
  }
}
