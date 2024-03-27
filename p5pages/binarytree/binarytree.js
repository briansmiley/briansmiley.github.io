let sclL = .5;
let sclR = .5;
let angL, angR;
let lrSlider;
let scaleSlider;
let tiltSlider;
let angSlider;
let minBranchSlider;
let controlPanel;
let mouseMode;
let taper;
let slowModePanel, slowMode, renderButton;
let rescale;
let colorStyleSelect, colorStylePanel, gradientSlider;
let colorPanel, backgroundSelector, treeColorSelector, gradientColorSelector, GRADIENT_COLOR, TREE_COLOR, BACKGROUND_COLOR;
const GRADIENT_LEN = 'Gradient (distance)';
const GRADIENT_BRANCH = 'Gradient (branch)'
const SOLID = 'Solid';
const RAINBOW = 'Rainbow';
let trunkBaseY,trunkBaseX, trunkLength;
let frameStart;
let TIMEOUT = 2000;
let TIMEDOUT = false;
let runFrame = true;
let message;
let minX, maxX, minY, maxY;

function setup() {
  BACKGROUND_COLOR = 230;
  TREE_COLOR = 0;
  GRADIENT_COLOR = BACKGROUND_COLOR;
  colorMode(HSB);
  blendMode(OVERLAY);
  angleMode(DEGREES);
  createCanvas(700, 600);
  generateControls();
  message = createDiv();
  message.id(`timeout`);
  trunkBaseX = width/2;
  trunkBaseY = height;
  trunkLength = 180;
  document.querySelector('main').children[1].before(message.elt);
  // message.parent(document.querySelector('main'));
}


function generateControls() {
  controlPanel = new ControlPanel('main_controls');
  mouseMode = controlPanel.addCheckbox('Mouse mode (m)',false);
  taper = controlPanel.addCheckbox('Taper branches (t) (slower)',true);

  //Slow mode/single render mode options
  slowModePanel = controlPanel.addPanel('slow_panel',controlPanel.container);
  slowMode = slowModePanel.addCheckbox('Single render mode', false);
  renderButton = slowModePanel.addButton('Render (r)');
  renderButton.mousePressed(() => runFrame = true);

  //Rescale button
  rescale = controlPanel.addButton('Scale canvas (s)');
  rescale.id('scale_canvas');
  rescale.mousePressed(() => {
    scaleCanvas();
  });
  
  
  
  scaleSlider = controlPanel.addTextboxSlider(0,830,690,1,'Scale Factor (x1000)<br>');
  //Branching angle slider
  angSlider = controlPanel.addTextboxSlider(0,180,25,.5,'Angle<br>','angle');
  //Minimum branch size recursion exit limit
  minBranchSlider = controlPanel.addTextboxSlider(1,10,5,1,'Min Branch Size<br>');
  //Overall tree tilt angle slider
  tiltSlider = controlPanel.addTextboxSlider(-90,90,0,.5,'Tilt<br>');
  //Antibias to L/R branch direction
  lrSlider = controlPanel.addTextboxSlider(-1,1,0,.001,'L/R Shrink<br>')
  //Color picker div
  colorPanel = controlPanel.addPanel('color_panel');
  colorPanel.container.html('Color')
  //Color style selector
  colorStyleSelect = colorPanel.addDropdown(); 
  colorStyleSelect.id('style_selector');
  let colorModes = [SOLID, GRADIENT_LEN, GRADIENT_BRANCH]
  colorModes.forEach((mode) => colorStyleSelect.option(mode));
  //Background color selector
  backgroundSelector = colorPanel.addColorPicker('Background ',BACKGROUND_COLOR,'background_select');
  //Tree color selector
  treeColorSelector = colorPanel.addColorPicker('Tree ', TREE_COLOR, 'tree_color_select');
  //Gradient color Selector
  gradientColorSelector = colorPanel.addColorPicker('Gradient ', GRADIENT_COLOR, 'gradient_selector');
  //Branch scaledown factor

}

function draw() {
  
  TIMEDOUT = false;
  renderButton.hide();
  frameStart = millis();
  if(slowMode.checked()) renderButton.show();

  
  if (mouseMode.checked()) {
    mouseMap(tiltSlider,mouseX);
    mouseMap(angSlider,mouseY);
  }
  
  //Control panel updates
  controlPanel.update();
  if (scaleSlider.value() > 725) scaleSlider.txt.class('warning');
  else scaleSlider.txt.removeClass('warning');
  let colorStyle = colorStyleSelect.value();
  colorStyle == GRADIENT_BRANCH || colorStyle == GRADIENT_LEN ? document.getElementById('gradient_selector').classList.remove('hidden') :
                                        document.getElementById('gradient_selector').classList.add('hidden');
  BACKGROUND_COLOR = backgroundSelector.value();
  

  if (runFrame) {
    message.html("");
    background(BACKGROUND_COLOR);
    renderTree();
    if (TIMEDOUT) message.html(`Render timed out; switched to single-frame render mode : ${Math.floor(millis() - frameStart)} ms frame time`);
    if (slowMode.checked()) console.log(`Render: ${2**totalBranches(trunkLength, minBranchSlider.value(), scaleSlider.value()/1000) - 1} branches in ${Math.trunc(millis() - frameStart)/1000} seconds`);
  }
  runFrame = !slowMode.checked();
  
}
function totalBranches(baseLength, minLimit, scale) {
  let endScale = minLimit/baseLength //Total multiplicative point where minimum branch length is reached
  return 1 + Math.floor(Math.log(endScale) / Math.log(scale)) //log_base_{scale}(endScle); power of {scale} which yields endScale, floor because we only go to integer powers of {scale} and dont overshoot
}
function branchLengthProgress(baseLength, minLimit, currentLength) {
  return (baseLength - currentLength) / (baseLength - minLimit);
}
function renderTree() {
  minX = trunkBaseX;
  maxX = trunkBaseX;
  minY = trunkBaseY;
  maxY = trunkBaseY;
  sclL = scaleSlider.value()/1000;
  sclR = scaleSlider.value()/1000;
  let s = lrSlider.value();
  if (s > 0) sclR *= (1 - s);
  if (s < 0) sclL *= (1 + s);
  // let angle = map(mouseY,0,height,0, PI);
  let angle = 0;
  
  

  branch(trunkBaseX,trunkBaseY,trunkLength,angle,15,scaleSlider.value()/1000,0);
}
//Maps a slider's value to the mouseX/Y value
function mouseMap(slider, mouseDir) {
  slider.value(map(mouseDir,0,mouseDir == mouseX ? width : height, slider.mn, slider.mx));
}
function keyPressed() {
  //toggle mouse mode to freeze tree state and free mouse
  switch (key) {
    case 'm':
      mouseMode.checked(!mouseMode.checked());
      break;
    case 't':
      taper.checked(!taper.checked());
      break;
    case 's':
      scaleCanvas();
      break;
    case 'r':
      runFrame = true;
      break;
  }
}
function taperLine(
  start_x,
  start_y,
  end_x,
  end_y,
  start_width,
  end_width,
  endRound = false
) {
    push();
    angleMode(DEGREES);
    let deltaX = end_x - start_x;
    let deltaY = end_y - start_y;
    let distance = sqrt(deltaX**2 + deltaY**2)
    let slope = atan2(deltaY, deltaX);
    translate(start_x,start_y);
    rotate(-90 + slope);

    beginShape();
    vertex(-start_width/2,0);
    vertex(start_width/2,0);
    vertex(end_width/2,distance);
    vertex(-end_width/2,distance);
    endShape(CLOSE);
    if(endRound) {
      arc(0,0,start_width,start_width,180,360,PIE);
      arc(0,distance,end_width,end_width,0,180,PIE);
    }
    pop();
  }

function gradient (oldColor, newColor = '#ffffff', frac) {
  push();
  colorMode(RGB);
  oldRed = red(oldColor);
  oldGreen = green(oldColor);
  oldBlue = blue(oldColor);
  newRed = red(newColor);
  newGreen = green(newColor);
  newBlue = blue(newColor);
  let nextColor = color([
    oldRed + (frac * (newRed - oldRed)),
    oldGreen + (frac * (newGreen - oldGreen)),
    oldBlue + (frac * (newBlue - oldBlue)),
  ]);
  pop();
  return nextColor;
}
function branch(x, y, len,ang,wgt,scl,lvl){
  if(len < minBranchSlider.value() || TIMEDOUT) return; //stop branching if we hit min branch limit or hit a render timeout

  if (millis() - frameStart > TIMEOUT && !slowMode.checked()) {
    console.log('Render timeout');      
    slowMode.checked(true);
    runFrame = false;
    TIMEDOUT = true;
    return;
  }
  minX = min(minX, x);
  minY = min(minY, y);
  maxX = max(maxX, x);
  maxY = max(maxY, y);
  //Draw a branch tapering down to the next branch size or of constant weight
  push();
    let newColor;
    let oldColor = treeColorSelector.value();
    let endColor = gradientColorSelector.value();
    switch (colorStyleSelect.value()) {
      case SOLID:
        newColor = treeColorSelector.value();
        break;
      case GRADIENT_BRANCH:
        let gradientFrac = map(lvl, 
                          0, totalBranches(trunkLength, minBranchSlider.value(), scl), 
                          0, 1);
        newColor = gradient(oldColor, endColor, gradientFrac);
        break;
      case GRADIENT_LEN:
        let gradientLengthBasedFrac = branchLengthProgress(trunkLength, minBranchSlider.value(), len);
        newColor = gradient(oldColor, endColor, gradientLengthBasedFrac); 
        break;
    }
    fill(newColor);
    stroke(newColor);
    strokeWeight(wgt)
    let nextX = x + len * sin(ang)
    let nextY = y - len * cos(ang)
    if (taper.checked() && len > 4) {
      push();
        noStroke();
        taperLine(x,y,nextX,nextY,wgt,wgt*scl,true);
      pop();
      // gradientLine(0,0,0,-len,wgt,wgt*scl,12);
    }

    else line(x,y,nextX,nextY);
  pop();
  
  if(len >= minBranchSlider.value()){
    let nextAng = ang + tiltSlider.value() + angSlider.value();
    let nextAng2 = ang + tiltSlider.value() - angSlider.value();
    branch(nextX,nextY,sclL*len,nextAng,max(.5,wgt*sclL),sclL, lvl+1);
    branch(nextX, nextY, sclR*len,nextAng2,max(.5,wgt*sclR),sclR, lvl+1);
  }
}

function rescaleCheck() {
  let xScale = max(1.1*(maxX - minX), 500);
  let yScale = max(1.1*(maxY - minY), 500);
  let rightSize = maxX - trunkBaseX;
  let leftSize = trunkBaseX - minX;
  let upSize = trunkBaseY - minY;
  let downSize = maxY - trunkBaseY;
  resizeCanvas(xScale, yScale);
  if (rightSize > width/2) trunkBaseX = .98 * width - rightSize;
  else if (leftSize > width/2) trunkBaseX = .02 * width + leftSize;
  else trunkBaseX = width/2;
  if (downSize > 0) trunkBaseY = .98*height - downSize;
  else trunkBaseY = height;
}
function scaleCanvas() {
  rescaleCheck();
  runFrame = true;
}

//Multi-step line version of doing a graded line, from StackOverflow, replced with my Trapezoid method
// function gradientLine(
//   start_x,
//   start_y,
//   end_x,
//   end_y,
//   start_weight,
//   end_weight,
//   segments
// ) {
//   let prev_loc_x = start_x;
//   let prev_loc_y = start_y;
//   for (let i = 1; i <= segments; i++) {
//     let cur_loc_x = lerp(start_x, end_x, i / segments);
//     let cur_loc_y = lerp(start_y, end_y, i / segments);
//     push();
//     strokeWeight(lerp(start_weight, end_weight, i / segments));
//     line(prev_loc_x, prev_loc_y, cur_loc_x, cur_loc_y);
//     pop();
//     prev_loc_x = cur_loc_x;
//     prev_loc_y = cur_loc_y;
//   }
// }
