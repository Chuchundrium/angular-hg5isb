export function isDefined(value: unknown): boolean {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value !== null && value !== undefined;
  } else if (typeof value === 'string' || value instanceof Array) {
    return !!value && value.length !== 0;
  } else if (value instanceof Date) {
    return !!value;
  } else if (typeof value === 'object') {
    return !!value && Object.keys(value).length !== 0;
  } else {
    return !!value;
  }
}
