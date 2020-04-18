import Model from "../Models/Model";
import View from "../Views/View";

export default class Controller {
  model: Model;
  view: View;
  
  
  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.render(this.model.value);

    this.view.bindMovePin((percentage: number) => {
      model.value = model.getPluginConfig().maxValue * percentage
    });

    
    this.model.bindSetValue((value: number) => {
      this.view.updateValue(value);
    })

  }

}