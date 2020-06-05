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
    if (model.getState().range) {
      const firstPinHandler = (newValue: number): void => {
        const currentState = model.getState();
        model.setState({ ...currentState, value: [newValue, (currentState.value as number[])[1]] });
      };
      const secondPinHandler = (newValue: number): void => {
        const currentState = model.getState();
        model.setState({ ...currentState, value: [(currentState.value as number[])[0], newValue] });
      };

      view.bindMovePin([firstPinHandler, secondPinHandler]);
    } else {
      view.bindMovePin((newValue: number): void => {
        const currentState = model.getState();
        model.setState({ ...currentState, value: newValue });
      });
    }

    view.bindInputChange((newValue: number | number[]) => {
      const currentState = model.getState();
      model.setState({ ...currentState, value: newValue });
    });

    model.bindSetState((value: number | number[]) => {
      view.updateValue(value);
    });

    view.bindScaleClick((value: number | number[]) => {
      const currentState = model.getState();
      model.setState({ ...currentState, value });
    });

    view.bindBarClick((value: number | number[]) => {
      const currentState = model.getState();
      model.setState({ ...currentState, value });
    });
  }
}
