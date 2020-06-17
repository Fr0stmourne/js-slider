export default function calculatePxNum({
  value,
  minValue,
  maxValue,
  elementSize,
}: {
  value: number;
  minValue: number;
  maxValue: number;
  elementSize: number;
}): number {
  if (elementSize < 0) throw new Error("Element size can't be negative");
  if (maxValue <= minValue) throw new Error('Max value should be greater than min value');
  if (value < minValue || value > maxValue) throw new Error('Value should be in stated boundaries');
  return (Math.abs(value - minValue) / Math.abs(maxValue - minValue)) * elementSize;
}
