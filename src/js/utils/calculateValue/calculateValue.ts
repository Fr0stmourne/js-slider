export default function calculateValue(percentage: number, minValue: number, maxValue: number): number {
  console.log(percentage, percentage < 0, percentage > 1);

  if (percentage < 0 || percentage > 1) throw new Error('Percentage must be in [0, 1] interval');
  if (maxValue <= minValue) throw new Error('Max value should be greater than min value');
  return minValue + percentage * Math.abs(maxValue - minValue);
}
