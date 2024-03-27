const MERLIN_PREVIEW = 'merlin_preview';
const MERLIN = 'merlin';
const DEFAULT = 'default';
const MODE = DEFAULT;


const REGIONS = 25;
const RESET_TIME = 7;
const fR = 60;
const SPEED = (MODE == DEFAULT) ? 0.25 : 0.05;
let show_dots = (true && MODE == DEFAULT);
const BOTTOM_BAR = 50;
const AUTO_REFRESH = false;

let controls;
let regionSlider;
let graph;

//FUTURE: group bottom controls into a Controls class that renders them all
// class Controls {
//   constructor() {
//     this.slider = new inputSlider();
//     this.dots = false;
    
//   }
//   render() {
    
//   }
// }
class inputSlider {
  constructor(mn, mx, initial) {
    this.mn = mn;
    this.mx = mx;
    this.container = this.makeContainer();
    this.slider = this.makeSlider(mn, mx, initial, this.container);
    this.txt = this.makeTextInput(initial, this.container)
  }
  makeContainer() {
    const container = createDiv();
    container.id('container');
    container.parent(document.querySelector('main'));
    return container;
  }
  makeSlider(mn, mx, initial, container) {
    const slider = createSlider(this.mn,this.mx,initial);
    slider.parent(container);
    return slider;
  }
  makeTextInput(initial, container) {
    const textInput = createInput(String(initial));
    textInput.parent(container);
    return textInput;
  }
  render() {
    //set slider value equal to the textbox value and vice versa
    this.txt.input( () => {
      let n = this.txt.value();
      this.slider.value(int(n));
    })
    this.txt.value(this.slider.value());
  }
  value() {
    return (this.slider.value());
  }
}
function setup() {
  angleMode(DEGREES);

  switch (MODE) {
    case MERLIN:
      createCanvas(44,66);
      break;
    case MERLIN_PREVIEW:
      createCanvas(484,660);
      break;
    case DEFAULT:
      createCanvas(700,700 + BOTTOM_BAR);
      break;
  }

  noStroke();
  colorMode(HSB, 360, 100, 100);
  if (MODE == DEFAULT) {
    regionSlider = new inputSlider(0,1000,REGIONS);
    // regionSlider.position(width - 220, height - (BOTTOM_BAR/1.1));

  }

  if (MODE == DEFAULT) graph = new Voronoi(regionSlider.value(),width, height - BOTTOM_BAR);
  else graph = new Voronoi(REGIONS,44,66);
  

}

class Voronoi {
  constructor(regions,w, h) {
    this.w = w;
    this.h = h;
    this.regions = regions;
    this.points = this.generatePoints();
    this.size = 0;
    this.buttonDiameter = BOTTOM_BAR - 10;
    this.fadeBuffer = createGraphics(this.w,this.h);
    this.fade = 0;
    this.fading = false;
    this.buffer = createGraphics(w,h);
    
    this.full = false;
    this.timer = 0;
  }
  
  render() {

    if (this.timer++ % (fR * RESET_TIME)  == 0 && AUTO_REFRESH) this.startFade();
    if (this.fading) {
      if (this.fade >= 300) this.reset();
      this.renderFade();
      this.fade+=2;
      return;
    }
    if (this.full) {
      regionSlider.render();
      this.drawResetButton();
      return;
    }
    
    //spread each region
    this.points.forEach((spreader) => {
      spreader.render(this.size);
    });
    
    //overwrite with buffered image
    image(this.buffer,0,0);
    
    //every 60 frames, check if the image is equal to the buffer, and if so we are done drawing
    if (frameCount % 60 == 0) this.checkFull();

    this.buffer.copy(get(), 0, 0, this.buffer.width, this.buffer.height, 0, 0, this.buffer.width, this.buffer.height);
    this.size += SPEED * 2;
    if (MODE == DEFAULT) {
      regionSlider.render();
      this.drawResetButton();
    }

  }
  reset() {
    clear();
    this.size = 0;
    this.timer = 0;
    this.fading = false;
    this.fadeBuffer.clear();
    this.fade = 0;
    this.full = false;
    if (MODE == DEFAULT) this.regions = regionSlider.value();
    else this.regions = REGIONS;
    this.points = this.generatePoints(this.regions);
    this.buffer = createGraphics(this.w,this.h);
  }
  generatePoints() {
    return Array.from({length:this.regions}, (_) => (
    new Spreader(this.w,this.h,color(random(360),random(60,100),MODE == MERLIN ? 70 : 100))
  ));
  }
  renderFade() {
    this.fadeBuffer.clear();
    this.fadeBuffer.noStroke();
    this.fadeBuffer.fill(0,0,0,this.fade);
    this.fadeBuffer.rect(0,0,this.fadeBuffer.width, this.fadeBuffer.height);
    image(this.fadeBuffer,0,0);
  }
  checkFull() {
    loadPixels();
    this.buffer.loadPixels();
    for (let i = 0; i < this.buffer.pixels.length; i++) {
      if (pixels[i] !== this.buffer.pixels[i]) {
        // If a difference is found, return false
        return false;
      }
    }
    console.log('canvas full?');
    this.full = true;
    return true;
  }
  drawResetButton() {

    push();
    fill(90);
    rect(0,this.w,this.w,BOTTOM_BAR);
    stroke(0);
    strokeWeight(6);
    arc(this.w/2,this.w + BOTTOM_BAR/2,this.buttonDiameter,this.buttonDiameter,90,360);
    fill(0);
    triangle(this.w/2 + this.buttonDiameter/2 - 5, this.w + BOTTOM_BAR/2, this.w/2 + this.buttonDiameter/2 + 5, this.w + BOTTOM_BAR/2, this.w/2 + this.buttonDiameter/2, this.w + BOTTOM_BAR/2 + 6);
    pop();
  }
  startFade() {
    push();
    this.buffer.fill(255);
    this.buffer.noStroke();
    this.buffer.rect(0,0,this.buffer.width,this.buffer.height);
    this.buffer.blend(get(),0,0,this.w,this.h,0,0,this.w,this.h,BLEND);
    image(this.buffer,0,0);
    pop();
    this.fading = true;
  }
  isClicked() {
    if (mouseX > this.w/2 - this.buttonDiameter/2 && mouseX < this.w/2 + this.buttonDiameter/2 && mouseY > this.w + BOTTOM_BAR/2 - this.buttonDiameter/2 && mouseY < this.w + BOTTOM_BAR/2 + this.buttonDiameter/2) {
      this.startFade();
    }
  }
}

class Spreader {
  constructor(w,h, colr) {
    this.x = random(MODE == DEFAULT ? w : 43);
    this.y = random(MODE == DEFAULT ? h : 66);
    this.colr = colr;
  }
  render(size) {
    push();
    fill(this.colr);
    circle(this.x, this.y, size * 2);
    fill(0);
    if (show_dots) circle(this.x, this.y, 4);
    pop();
  }
}
function mouseClicked() {
  graph.isClicked();
}

function merlinPreview(){
    if (MODE == MERLIN || MODE == MERLIN_PREVIEW) {
      push();
      colorMode(RGB);
      stroke(255);
      fill(255);
      line(45,0,45,height);
      rect(0,66,45,height);
      fill(0);
      rect(46,0,width,height);
      rectMode(CENTER);
      for (let i = 0; i < 44; i++) {
        for (let j = 0; j < 66; j++) {
          let pix = get(i,j);
          fill(pix);
          stroke(0);
          rect(50 + (i*10), 5 + (j*10),3,3);
        }
      }
      pop();
  }
}

function draw() {
  if (frameCount % 30 == 0) console.log(frameRate());
  graph.render();
  merlinPreview();
}
