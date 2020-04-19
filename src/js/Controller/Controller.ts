import Model from "../Models/Model";
import View from "../Views/View";

export default class Controller {
  model: Model;
  view: View;
  
  
  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.render(this.model.value);

    if (this.model.getPluginConfig().range) {
      const firstPinHandler = (percentage: number) => {
        // (<number[]>this.model.value)[0] = this.model.getPluginConfig().maxValue * percentage
        this.model.value = [this.model.getPluginConfig().maxValue * percentage, (<number[]>this.model.value)[1]]
        console.log(this.model.value);
      };
      const secondPinHandler = (percentage: number) => {
        this.model.value = [(<number[]>this.model.value)[0], this.model.getPluginConfig().maxValue * percentage]
        console.log(this.model.value);
      };
      this.view.bindMovePin([firstPinHandler, secondPinHandler]);
    } else {
      this.view.bindMovePin((percentage: number) => {
        this.model.value = this.model.getPluginConfig().maxValue * percentage
        console.log(this.model.value);
      });
    }


    this.view.bindInputChange((e: Event) => {
    //  console.log('changed:', (<HTMLInputElement>e.target).value);
     model.value = +(<HTMLInputElement>e.target).value;
    })

    
    this.model.bindSetValue((value: number | number[]) => {
      console.log('trigger');
      
      this.view.updateValue(value);
    })

  }

}