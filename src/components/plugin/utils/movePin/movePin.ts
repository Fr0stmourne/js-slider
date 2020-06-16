export default function movePin({
  pinElement,
  value,
  isVertical,
}: {
  pinElement: HTMLElement;
  value: number;
  isVertical?: boolean;
}): void {
  isVertical = isVertical || false;
  pinElement.style[isVertical ? 'bottom' : 'left'] = `${value}px`;
}
