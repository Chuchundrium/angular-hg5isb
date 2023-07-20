export function leastCommonMultiple(a: number, b: number): number {
  if (a < 0 || b < 0 || a % 1 !== 0 || b % 1 !== 0) {
    return 0;
  }

  const gcd = greatestCommonDivisor(a, b);
  return (a * b) / gcd;
}

function greatestCommonDivisor(a: number, b: number) {
  while (a !== b) {
    const d = Math.abs(a - b);
    const min = Math.min(a, b);
    a = d;
    b = min;
  }
  return a;
}

export function fromDegToRad(angle: number) {
  return angle * (Math.PI / 180);
}

// y = kx + b
export const y = (x: number, k: number, b: number) => k * x + b;
export const x = (y: number, k: number, b: number) => (y - b) / k;

export const isRightAngle = (angle: number) =>
  angle === Math.PI / 2 || angle === -Math.PI / 2;
export const isZeroAngle = (angle: number) => angle === 0;

export const roundToAbsLarger = (value: number) =>
  value > 0 ? Math.ceil(value) : Math.floor(value);
