import render from 'View/utils/render';

import DefaultView from '../DefaultView';

class ProgressView extends DefaultView {
  constructor(private isVertical: boolean) {
    super();
    this.render();
  }

  setPadding(percentage: number): void {
    if (this.isVertical) {
      this.element.style.bottom = `${percentage}%`;
    } else {
      this.element.style.left = `${percentage}%`;
    }
  }

  setWidth(percentage: number): void {
    if (this.isVertical) {
      this.element.style.height = `${percentage}%`;
    } else {
      this.element.style.width = `${percentage}%`;
    }
  }

  render(): void {
    this.element = render(
      `
      <div class="slider-plugin__progress js-progress"></div>
      `,
    );
  }
}

export default ProgressView;
