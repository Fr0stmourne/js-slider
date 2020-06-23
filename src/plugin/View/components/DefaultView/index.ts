import Observer from 'Observer';

abstract class DefaultView extends Observer {
  public element!: HTMLElement;

  render(): void {
    // set element
  }
}

export default DefaultView;
