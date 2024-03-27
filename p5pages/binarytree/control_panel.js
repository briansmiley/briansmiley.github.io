class ControlPanel {
  constructor(id) {
    this.container = this.createContainer(id);
    this.controls = [];
    this.id = id;
  }
  createContainer(id) {
    const container = createDiv();
    container.addClass('control_panel');
    container.parent(document.querySelector('main'));
    container.id(id);
    return container;
  }
  //add a preExisting already-containerized control to the set
  addControl(controlDiv) {
    this.controls.push(controlDiv);
    controlDiv.parent(this);
  }

  //add a sub-panel group
  addPanel(id) {
    let newPanel = new ControlPanel(id)
    newPanel.parent = this.container; //put the new control panel object inside the parent one's div container
    this.controls.push(newPanel); //add it to the list of controls in this one (lets update() work seamlessly)
    return newPanel;
  }
  
  //create a new textboxSlider() control 
  addTextboxSlider(mn, mx, initial, step = 0, label = '', id = "") {
    let slider = new textboxSlider(mn, mx, initial, step, this.container, label, id)
    this.controls.push(slider);
    return slider;
  }
  
  addCheckbox(label = '',state = false, par = this) {
    let check = createCheckbox(label,state);
    check.parent(par.container);
    this.controls.push(check);
    return check;
  }

  addButton(label, value, par = this) {
    let button = createButton(label, value);
    this.controls.push(button);
    button.parent(par.container);
    return button;
  }
  
  update() {
    this.controls.forEach((setting) => {
      if (typeof setting.update == 'function') setting.update();
    });
  }
}
