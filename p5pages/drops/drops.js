let canvas;
let drops = [];
let colorModeSelect, dpsSlider, spreadRateSlider, rippleDurationSlider, rippleWeightSlider;
const rgb = 'RGB';
const hsb = 'HSB';
const GRAY = 'Grayscale';
const PASTEL = 'Pastel';
const colorOptions = [hsb, rgb, PASTEL, GRAY];
let lastDropsFrame, timePerDrop;
function setup() {
  colorMode(HSB);
  canvas = createCanvas(600, 600);
  canvas.parent('canvas-box');

  generateControls();
  lastDropsFrame = 0;
}

function draw() {
  background(0);
  createDrops();
  drops.forEach( (drop) => drop.frame());
  drops = drops.filter((drop) => {
    drop.frame();
    return brightness(drop.colr) >   .05;
  });
}

function generateControls() {
  colorModeSelect = createSelect();
  colorModeSelect.parent('color-select');
  colorOptions.forEach((i) => colorModeSelect.option(i));

  dpsSlider = createSlider(0.5, 150, 20, 0); //drops per second assuming 60fps
  dpsSlider.parent('drop-rate');

  spreadRateSlider = createSlider(.01, 1, .5,0);
  spreadRateSlider.parent('spread-rate');

  rippleDurationSlider = createSlider(50, 5000, 1500);
  rippleDurationSlider.parent('ripple-duration');

  rippleWeightSlider = createSlider(.5, 10, 2, 0);
  rippleWeightSlider.parent('ripple-weight');
}

function createDrops() {
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
  // let sinceLastDrops = frameCount - lastDropsFrame; //frames since last drop
  // let interval = 1000/dpsSlider.value() //milliseconds of elapsed time each drop "gets"
  // let newDrops = floor(sinceLastDrops / interval); //number of full intervals "unused" in the pool of elapsed time
  // if (newDrops >= 1) {
  //   lastDropsFrame += newDrops * interval; //remove [interval] ms for each drop we're creating
  // }
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
    default:
      return 100;
  }
}

//Returns an integer probabalistically rounding the argument up or down
//integer.decimal has a decimal chance to yield integer + 1
function probabalisticInt(flt) {
  return floor(flt) + int(random() < (flt % 1))
}