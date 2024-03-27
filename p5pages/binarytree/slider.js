//A slider with an editable textbox reflecting the slider's value, inside a div container for placement using html/CSS

class textboxSlider {
  constructor(mn, mx, initial, step = 0, parent = document.querySelector('main'),label = '',containerID = "") {
    this.mn = mn; //min value
    this.mx = mx; //max value
    this.label = label;
    this.id = containerID;
    this.container = this.makeContainer(containerID, parent, label); //div container for slider/text
    this.slider = this.makeSlider(mn, mx, initial, step,this.container);
    this.txt = this.makeTextInput(initial, this.container)
  }
  makeContainer(id, parent, label) {
    const container = createDiv(label);
    container.id(id);
    container.addClass('textboxSlider');
    container.parent(parent);
    return container;
  }
  makeSlider(mn, mx, initial, step, container) {
    const slider = createSlider(mn,mx, initial, step);
    slider.parent(container);
    return slider;
  }
  //create text input box element and place it in div container
  makeTextInput(initial, container) {
    const textInput = createInput(String(initial));
    textInput.parent(container);
    return textInput;
  }
  //update slider/text values to reflect one another
  update() {
    //set slider value equal to the textbox value and vice versa
    this.txt.input( () => {
      let n = this.txt.value();
      this.slider.value(int(n));
    })
    this.txt.value(this.slider.value());
  }
  value(val = this.slider.value()) {
    this.slider.value(val);
    this.update();
    return (this.slider.value());
  }
}



