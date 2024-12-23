class ControlPanel {
  constructor(id, parent = document.querySelector('main')) {
    this.container = this.createContainer(id,parent);
    this.controls = [];
    this.id = id;
  }
  createContainer(id, parent) {
    const container = createDiv();
    container.addClass('control_panel');
    container.parent(parent);
    container.id(id);
    return container;
  }
  //add a preExisting already-containerized control to the set
  addControlDiv(controlDiv) {
    this.controls.push(controlDiv);
    controlDiv.parent(this);
  }

  //add an element and label it
  addControl(label = '', id = '') {
    let control = createDiv(label);
    control.id(id);
    control.parent(this.container);
    return control;
  }

  //add a sub-panel group
  addPanel(id) {
    let newPanel = new ControlPanel(id)
    newPanel.container.parent(this.container); //put the new control panel object inside the parent one's div container
    this.controls.push(newPanel); //add it to the list of controls in this one (lets update() work seamlessly)
    return newPanel;
  }
  
  addColorPicker(label = '', colr = '', id = '') {
    let picker = createColorPicker(colr);
    let container = createDiv(label);
    picker.parent(container);
    container.id(id);
    container.parent(this.container);
    return picker

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

  addButton(label, par = this) {
    let button = createButton(label);
    this.controls.push(button);
    button.parent(par.container);
    return button;
  }

  addDropdown(label, par = this) {
    let dropdown = createSelect();
    dropdown.parent(this.container);
    this.controls.push(dropdown);
    return dropdown;
  }

  addSlider(min, max, value, step = 0, parent = this.container) {
    let slider = createSlider(min, max, value, step)
    slider.parent(parent);
    this.controls.push(slider);
    return slider;
  }
  
  update() {
    this.controls.forEach((setting) => {
      if (typeof setting.update == 'function') setting.update();
    });
  }
}
