import Model from "../Models/Model";
import View from "../Views/View";

export default class Controller {
  model: Model;
  view: View;
  
  
  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.bindMovePin((percentage: number) => {
      model.value = model.getPluginConfig().maxValue * percentage
      console.log('model value', model.value);
    });
  }

  // bind() {
  //   this.view.handleChange = (e: Event) => {
  //     const pinElement = e.target as HTMLElement;
  //     console.log(pinElement.style.left);
  //     // console.log(e);
  //     this.model.value = +(pinElement.style.left).split('px')[0] || 0; 
  //     console.log(this.model.getPluginConfig());
      
  //   }
  // }

}