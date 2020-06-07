import Model from '../Models/Model';
import View from '../Views/View/View';

export default class Controller {
  constructor(public model: Model, public view: View) {
    this.model = model;
    this.view = view;
    this.view.render();
    this.connect();
  }

  connect(): void {
    const { model, view } = this;
    const currentState = model.getState();

    function setModelValue(value: number | number[]): void {
      model.setState({ ...currentState, value });
    }

    view.bindMovePin(setModelValue);

    view.bindInputChange(setModelValue);

    view.bindScaleClick(setModelValue);

    view.bindBarClick(setModelValue);

    model.bindSetState((value: number | number[]) => {
      view.updateValue(value);
    });
  }
}
