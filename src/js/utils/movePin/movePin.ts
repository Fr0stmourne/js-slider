export default function movePin(pinElement: HTMLElement, value: number, isVertical: boolean): void {
  pinElement.style[isVertical ? 'bottom' : 'left'] = value + 'px';
}
