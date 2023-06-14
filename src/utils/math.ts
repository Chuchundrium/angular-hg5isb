export function leastCommonMultiple(a: number, b: number): number {
  console.log('leastCommonMultiple...', a, b);

  const gcd = greatestCommonDivisor(a, b);
  return (a * b) / gcd;
}

function greatestCommonDivisor(a: number, b: number) {
  console.log('greatestCommonDivisor...', a, b);
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
