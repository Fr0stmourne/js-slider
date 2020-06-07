export default function movePin(pinElement: HTMLElement, value: number, isVertical = false): void {
  pinElement.style[isVertical ? 'bottom' : 'left'] = value + 'px';
}
