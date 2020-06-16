export default function calculateSteps({
  minValue,
  maxValue,
  step,
}: {
  minValue: number;
  maxValue: number;
  step: number;
}): number[] {
  const steps = [];
  for (let i = minValue; i < maxValue; i += step) {
    steps.push(i);
    if (i + step >= maxValue) steps.push(maxValue);
  }
  return steps;
}
