export default function calculateSteps({
  minValue,
  maxValue,
  step,
}: {
  minValue: number;
  maxValue: number;
  step: number;
}): number[] {
  const emptySteps = Array(Math.floor((maxValue - minValue) / step) + 1).fill(null);
  return emptySteps.reduce((acc: number[], el: number, index: number) => {
    acc.push(Math.min(minValue + index * step, maxValue));
    const hasMaxValue = acc.includes(maxValue);
    const nextGreaterThanMax = minValue + (index + 1) * step > maxValue;
    if (nextGreaterThanMax && !hasMaxValue) acc.push(maxValue);
    return acc;
  }, []);
}
