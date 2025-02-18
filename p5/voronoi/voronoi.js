const MERLIN_PREVIEW = 'merlin_preview';
const MERLIN = 'merlin';
const DEFAULT = 'default';
const WACKY = 'wacky';

let MODE = DEFAULT;
const MERL = (MODE == MERLIN) || (MODE == MERLIN_PREVIEW);
const REGIONS = 25;
const RESET_TIME = 5;
const FADE_TIME = !MERL ? 1 : 5;
const fR = 60;

let show_dots = (true && (!MERL));
const BOTTOM_BAR = 50;
const AUTO_REFRESH = false || MERL;

let controls;
let regionSlider;
let graph;
let c;

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

class dotToggle {
  constructor(vor) {
    this.x = vor.w * .8;
    this.y = vor.w + BOTTOM_BAR/2;
    this.parent = vor;
    this.state = show_dots;
    this.size = 15;
    this.hitbox = this.size*1.25;
  }
  render() {
    push();
    translate(this.x,this.y);
    fill(this.state ? 0 : 55);
    noStroke();
    circle(0,0,20);
    fill(0);
    if (this.parent.mouseInRegion(this.x,this.y,this.size)) {
      text('toggle dots & reset',-50,this.hitbox);
    }
    pop();
  }
  wasClicked() {
    this.state = !this.state;
    this.parent.startFade();
  }
}
function setup() {
  angleMode(DEGREES);

  switch (MODE) {
    case MERLIN:
      c =createCanvas(44,66);
      break;
    case MERLIN_PREVIEW:
      c =createCanvas(484,660);
      break;
    default:
      c =createCanvas(700,700 + BOTTOM_BAR);
      break;
  }


  noStroke();
  colorMode(HSB, 360, 100, 100);
  if (!MERL) {
    regionSlider = new inputSlider(0,1000,REGIONS);
    // regionSlider.position(width - 220, height - (BOTTOM_BAR/1.1));

  }

  if (!MERL) graph = new Voronoi(regionSlider.value(),width, height - BOTTOM_BAR);
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
    this.fadeStep = 1.5;
    this.fadeBuffer = this.setupFadeBuffer(this.fadeStep);
    this.fade = 0;
    this.fading = false;
    this.buffer = createGraphics(w,h);
    this.fadeStart = 0;
    this.full = false;
    this.speed = this.setSpeed();
    this.filledTime = 0;
    this.startTime = millis();
    this.dotToggle = new dotToggle(this);
  }
  
  render() {


    if (this.fading) {
      this.renderFade();
      if (this.fade >= 255) this.reset();
      // this.fade+=1;
      return;
    }
    
    if (this.full && this.timeSinceFull() >= RESET_TIME && AUTO_REFRESH) {
      // console.log(this.timeSinceFull());
      this.startFade();
    }
    if (this.full) {
      if (!MERL) {
        this.drawResetButton();
        regionSlider.render();
        this.dotToggle.render();
      
      }
      return;
    }
    if(MERL) clear();
    
    
    //spread each region
    this.points.forEach((spreader) => {
      spreader.render(this.size);
    });
    //every half second, check if the image is equal to the buffer, and if so we are done drawing
    //overwrite with buffered image
    image(this.buffer,0,0);
    if (frameCount % 60 == 0) this.checkFull();
    
    //Copy the current finalized frame other than background stuff) to buffer
    this.buffer.copy(get(), 0, 0, this.buffer.width, this.buffer.height, 0, 0, this.buffer.width, this.buffer.height);
    
    //if in MERLIN modes, draw a black background and overwrite the buffer again
    if(MERL) {
      background(0);
      image(this.buffer,0,0);
    }
    
    this.size += this.speed;
    if (!MERL) {
      regionSlider.render();
      
      this.drawResetButton();
      this.dotToggle.render();
    }

  }
  //draws a black rectangle background, for MERLIN modes where we dont want white
  blackground() {
    push();
    fill(0);
    rect(0,0,this.w,this.h);
    pop();
  }
  setSpeed() {
    return {
      [DEFAULT]: .75,
      [MERLIN]: .05,
      [MERLIN_PREVIEW]: .1,
      [WACKY]: map(this.regions,1,1000,11,3)
    }[MODE] || 1
  }
  timeElapsed() {
    return ((millis() - this.startTime) / 1000);
  }
  timeSinceFull() {
    return ((millis() - this.filledTime ) / 1000);
  }
  reset() {
    // console.log('Reset');
    clear();
    this.buffer.clear();
    this.size = 0;
    this.t
    this.startTime = millis();
    this.fading = false;
    this.fade = 0;
    this.full = false;
    if (!MERL) this.regions = regionSlider.value();
    else this.regions = REGIONS;
    this.speed = this.setSpeed();
    this.points = this.generatePoints(this.regions);

  }
  generatePoints() {
    return Array.from({length:this.regions}, () => {
      
      //Generate a random RGB triplet color
      let RGBColr = Array.from({length:3}, () => int(random(255)));
      let HSBColr = rgbToHSB(RGBColr);
      return new Spreader(
        this.w,
        this.h,
        //Assign spreader the RGB or HSB based random color
        Math.random() < .5 
          ? HSBColr //RGB-value-based
          : color(random(360), //random hue
                  random(60,100), //saturation
                  MODE == MERLIN //brightness depends on whether this is for MERLIN mode
                    ? 70
                    : 100
                 ),
        this
      )
    }
                     
                     
                     )
  }
                      // new Spreader(this.w,this.h,color(random(360),random(60,100),MODE == MERLIN ? 70 : 100),this)
  setupFadeBuffer(){
    //initialize the blackout buffer with an equal sized canvas and a black rectangle alpha 1
    let buff = createGraphics(this.w,this.h)
    buff.noStroke();
    buff.fill(0,1);
    buff.rect(0,0,this.w, this.h);
    return buff;
  }
  renderFade() {
    //set alpha for blackout based on time elapsed since fade started
    this.fade = (millis() - this.fadeStart)*(255 / FADE_TIME)/1000;
    
    //clear the fadeout buffer and fill it with a rectangle of appropriate alpha
    this.fadeBuffer.clear()
    this.fadeBuffer.fill(0,0,0,this.fade);
    this.fadeBuffer.rect(0,0,this.w,this.h);
    
    //image the canvas then draw the fadeout rectangle over it
    image(this.buffer,0,0);
    image(this.fadeBuffer,0,0);

  }
  checkFull() {
    // console.log('checking fullness');
    let img = get(0,0,this.w,this.h);
    let buff = this.buffer.get(0,0,this.w,this.h);
    buff.loadPixels();
    img.loadPixels();
    for (let i = 0; i < buff.pixels.length; i++) {
      
      if (img.pixels[i] !== buff.pixels[i]) {
        // If a difference is found, return false
        // console.log('not full');
        return false;
      }
    }
    console.log('canvas full');
    this.full = true;
    this.filledTime = millis();
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
    if(!MERL) {
      push();
      this.buffer.fill(255);
      this.buffer.noStroke();
      this.buffer.rect(0,0,this.buffer.width,this.buffer.height);
      this.buffer.blend(get(),0,0,this.w,this.h,0,0,this.w,this.h,BLEND);
      image(this.buffer,0,0);
      pop();
    }
    this.fadeStart = millis();
    this.fading = true;
  }
  
  isClicked() {
    if (mouseX > this.w/2 - this.buttonDiameter/2 && mouseX < this.w/2 + this.buttonDiameter/2 && mouseY > this.w + BOTTOM_BAR/2 - this.buttonDiameter/2 && mouseY < this.w + BOTTOM_BAR/2 + this.buttonDiameter/2) {
      this.startFade();
    }
    if (this.mouseInRegion(this.dotToggle.x, this.dotToggle.y, this.dotToggle.size)) this.dotToggle.wasClicked();
  }
  //Returns true if mouse is inside a square of side length [size] centered on (x,y)
  mouseInRegion(x,y,size) {
    return (mouseX > x - size/2 && mouseX < (x + size/2) && mouseY > y - size/2 && mouseY < (y + size/2))
  }
}

class Spreader {
  constructor(w,h, colr, vor) {
    this.x = random(!MERL ? w : 43);
    this.y = random(!MERL ? h : 66);
    this.parent = vor;
    this.colr = colr;
  }
  render(size) {
    push();
    fill(this.colr);
    circle(this.x, this.y, size * 2);
    fill(0);
    if (show_dots && this.parent.dotToggle.state) circle(this.x, this.y, 4);
    pop();
  }
}
function mouseClicked() {
  graph.isClicked();
}

let ceilingShine = true;
function toBrightness(colr, brt) {
  //takes in an HSB pixel and returns it at the given brightness
  // return color(`HSB(hue(${colr}),saturation(${colr}),${brt})`)
  return [hue(colr),saturation(colr),brt]
}
function rgbToHSB(pix) {
  return (color(`RGB(${pix[0]},${pix[1]},${pix[2]})`));
}
function merlinPreview(){
    if (MODE == MERLIN_PREVIEW) {
      push();
      colorMode(HSB);
      noStroke();
      fill(255);
      // line(45,0,45,height);
      rect(0,66,44,height);
      fill(0);
      rect(44,0,width,height);
      rectMode(CENTER);
      noStroke();
      for (let i = 0; i < 44; i++) {
        for (let j = 0; j < 66; j++) {
          let pix = get(i,j);
          pix = rgbToHSB(pix);
          if (ceilingShine) {
            
            //Too many concentric circle-based fading ceiling shine
            // for(let d = 10; d>2; d-=2) {
            //   fill(toBrightness(pix,brightness(pix)* min(0.6,(1.2-(d/10)))));
            //   circle(50 + (i*10), 5 + (j*10),d);
            // }
            //*
            
            //Stroke-based ceilingshine
            fill(pix);
            stroke(toBrightness(pix,.35*brightness(pix)));
            strokeWeight(3.5);
            circle(50 + (i*10), 5 + (j*10),6.5);
          }
          
          else{
            //Just draw a colored circle
            fill(pix);
            circle(50 + (i*10), 5 + (j*10),3)
          }
        }
      }
      pop();
  }
}

function draw() {
  // if (frameCount % 30 == 0) console.log(frameRate());
  graph.render();
  merlinPreview();
}
