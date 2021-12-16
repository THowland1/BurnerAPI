export function string(
  value: any,
  errorMessage: string
): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(errorMessage);
  }
}
