let canvas;
let drops = [];
let colorModeSelect, dpsSlider, spreadRateSlider, rippleDurationSlider, rippleWeightSlider;
let backgroundColorSelect, dropColorSelect, dropColorContainer;
const rgb = 'RGB';
const hsb = 'HSB';
const GRAY = 'Grayscale';
const PASTEL = 'Pastel';
const SINGLE = 'Single color';
const colorOptions = [hsb, rgb, PASTEL, GRAY, SINGLE];
let lastDropsFrame, timePerDrop;
function setup() {
  colorMode(HSB);
  // let dim = min(windowWidth, .8*windowHeight, 700);
  canvas = createCanvas(windowWidth, .8*windowHeight);
  canvas.parent('canvas-box');

  generateControls();
  lastDropsFrame = 0;
}

function draw() {
  colorModeSelect.value() == SINGLE ? 
    dropColorContainer.classList.remove('hidden') :
    dropColorContainer.classList.add('hidden');

  background(backgroundColorSelect.value());
  createDrops();
  drops.forEach( (drop) =>drop.frame());
  drops = drops.filter((drop) => {
    drop.frame();
    return alpha(drop.colr) > 0;
  });
}

function generateControls() {
  colorModeSelect = createSelect();
  colorModeSelect.parent('color-select-container');
  colorOptions.forEach((i) => colorModeSelect.option(i));

  dropColorSelect = createColorPicker('white');
  dropColorContainer = document.getElementById('drop-color-picker-container');
  dropColorSelect.parent(dropColorContainer);

  backgroundColorSelect = createColorPicker('black');
  backgroundColorSelect.parent('background-color-picker-container');

  wallReflections = createCheckbox('',true);
  wallReflections.parent('reflection-checkbox-container');
  dpsSlider = createSlider(0, width*height/2500, width*height/50000, 0); //drops per second assuming 60fps
  dpsSlider.parent('drop-rate-container');

  spreadRateSlider = createSlider(.01, 2, .5,0);
  spreadRateSlider.parent('spread-rate-container');

  rippleDurationSlider = createSlider(50, 7500, 2500);
  rippleDurationSlider.parent('ripple-duration-container');

  rippleWeightSlider = createSlider(.5, 20, 3, 0);
  rippleWeightSlider.parent('ripple-weight-container');
}

function createDrops() {
  if (wallReflections.checked()) drops.forEach((drop) => drop.reflections());
  if (dpsSlider.value() <= 60) {
    let framesPerDrop = probabalisticInt(60 / dpsSlider.value());
    if (frameCount % framesPerDrop == 0) drops.push(new Drop());
    return 1;
  }
  else {
    let dropsPerFrame = probabalisticInt(dpsSlider.value() / 60);
    Array.from({length: dropsPerFrame}, () => drops.push(new Drop())); //create that many new drops
    return dropsPerFrame;
  }
}
function randomColor() {
  let colr;
  switch (colorModeSelect.value()) {
    case rgb:
      colr = Array.from({length:3}, () => int(random(255)));
      return (color(`RGB(${colr[0]},${colr[1]},${colr[2]})`));
    case hsb:
      return color([random(360), 100, 100]);
    case GRAY:
      return color(0,0,100);
    case PASTEL:
      return color([random(360), random(100), 100]);
    case SINGLE:
      return dropColorSelect.value();
    default:
      return 100;
  }
}

//Returns an integer probabalistically rounding the argument up or down
//integer.decimal has a decimal chance to yield integer + 1
function probabalisticInt(flt) {
  return floor(flt) + int(random() < (flt % 1))
}

function  windowResized() {
  // let dim = min(windowWidth, .8*windowHeight, 700);
  let prevDps = dpsSlider.value()/dpsSlider.max;
  resizeCanvas(windowWidth, .8*windowHeight);
  dpsSlider.attribute('max',width*height/2500);
  dpsSlider.value(prevDps * dpsSlider.max);
}

function mousePressed() {
  if (mouseX > width || mouseY > height) return;
  let d = new Drop();
  d.x = mouseX;
  d.y = mouseY;
  drops.push(d);
  console.log(mouseX, mouseY)
}