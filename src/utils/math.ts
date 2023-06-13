export function leastCommonMultiple(a: number, b: number): number {
  const gcd = greatestCommonDivisor(a, b);
  console.log({ gcd });
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
