class ControlPanel {
  constructor() {
    this.container = this.createContainer();
    this.controls = [];
  }
  createContainer() {
    const container = createDiv();
    container.addClass('control_panel');
    container.parent(document.querySelector('main'));
    return container;
  }
  //add a preExisting already-containerized control to the set
  addControl(controlDiv) {
    this.controls.push(controlDiv);
    controlDiv.parent(this);
  }
  
  //create a new textboxSlider() control 
  addTextboxSlider(mn, mx, initial, step = 0, label = '', id = "") {
    let slider = new textboxSlider(mn, mx, initial, step, this.container, label, id)
    this.controls.push(slider);
    return slider;
  }
  
  addCheckbox(label = '',state = false,parent = this) {
    let check = createCheckbox(label,state);
    check.parent(parent.container);
    this.controls.push(check);
    return check;
  }
  
  update() {
    this.controls.forEach((setting) => {
      if (typeof setting.update == 'function') setting.update();
    });
  }
}