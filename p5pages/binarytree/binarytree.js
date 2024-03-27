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
let trunkBaseY,trunkBaseX;
let frameStart;
let TIMEOUT = 2000;
let TIMEDOUT = false;
let runFrame = true;
let message;
let minX, maxX, minY, maxY;

function setup() {
  angleMode(DEGREES);
  createCanvas(700, 600);
  generateControls();
  message = createDiv();
  message.id(`timeout`);
  trunkBaseX = width/2;
  trunkBaseY = height;
  document.querySelector('main').children[1].before(message.elt);
  // message.parent(document.querySelector('main'));
}


function generateControls() {
  controlPanel = new ControlPanel('main_controls');
  mouseMode = controlPanel.addCheckbox('Mouse mode (m)',false);
  taper = controlPanel.addCheckbox('Taper branches (t) (slower)',true);
  slowModePanel = controlPanel.addPanel('slow_mode',controlPanel.container);
  slowMode = slowModePanel.addCheckbox('Single render mode', false);
  rescale = controlPanel.addButton('Scale canvas');
  rescale.mousePressed(() => {
    rescaleCheck();
    runFrame = true;
  });
  renderButton = slowModePanel.addButton('Render');
  renderButton.mousePressed(() => runFrame = true);
  scaleSlider = controlPanel.addTextboxSlider(0,.83,0.65,0.001,'Scale Factor<br>');
  angSlider = controlPanel.addTextboxSlider(0,180,25,.5,'Angle<br>','angle');
  minBranchSlider = controlPanel.addTextboxSlider(1,10,5,1,'Min Branch Size<br>');
  tiltSlider = controlPanel.addTextboxSlider(-90,90,0,.5,'Tilt<br>');
  lrSlider = controlPanel.addTextboxSlider(-1,1,0,.001,'L/R Shrink<br>')

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
  controlPanel.update();
  if (scaleSlider.value() > .77) scaleSlider.txt.class('warning');
  else scaleSlider.txt.removeClass('warning');
  

  if (runFrame) {
    message.html("");
    background(220);
    renderTree();
    if (TIMEDOUT) message.html(`Render timed out; switched to single-frame render mode : ${Math.floor(millis() - frameStart)} ms frame time`);
  }
  runFrame = !slowMode.checked();
  
}

function renderTree() {
  minX = trunkBaseX;
  maxX = trunkBaseX;
  minY = trunkBaseY;
  maxY = trunkBaseY;
  sclL = scaleSlider.value();
  sclR = scaleSlider.value();
  let s = lrSlider.value();
  if (s > 0) sclR *= (1 - s);
  if (s < 0) sclL *= (1 + s);
  let length = 180;
  // let angle = map(mouseY,0,height,0, PI);
  let angle = 0;
  

  branch(trunkBaseX,trunkBaseY,length,angle,15,scaleSlider.value());
  if (millis() - frameStart > TIMEOUT) {
    if (slowMode.checked()) return;
    if (!TIMEDOUT) {
      console.log('Render timeout');      
      slowMode.checked(true);
      runFrame = false;
    }
    TIMEDOUT = true;
    return;
  }
}
//Maps a slider's value to the mouseX/Y value
function mouseMap(slider, mouseDir) {
  slider.value(map(mouseDir,0,mouseDir == mouseX ? width : height, slider.mn, slider.mx));
}
function keyPressed() {
  //toggle mouse mode to freeze tree state and free mouse
  if (key == 'm') mouseMode.checked(!mouseMode.checked());
  if (key == 't') taper.checked(!taper.checked());
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

function branch(x, y, len,ang,wgt,scl,canv){
  minX = min(minX, x);
  minY = min(minY, y);
  maxX = max(maxX, x);
  maxY = max(maxY, y);
  //Draw a branch tapering down to the enxt branch size or of constant weight
  strokeWeight(wgt)
  let nextX = x + len * sin(ang)
  let nextY = y - len * cos(ang)
  if (taper.checked() && wgt > 3 && len > 4) {
    push();
    fill(0);
    noStroke();
    taperLine(x,y,nextX,nextY,wgt,wgt*scl,true);
    pop();
    // gradientLine(0,0,0,-len,wgt,wgt*scl,12);
  }

  else line(x,y,nextX,nextY);

  
  if(len >= minBranchSlider.value()){
    let nextAng = ang + tiltSlider.value() + angSlider.value();
    let nextAng2 = ang + tiltSlider.value() - angSlider.value();
    branch(nextX,nextY,sclL*len,nextAng,max(.5,wgt*sclL),sclL);
    branch(nextX, nextY, sclR*len,nextAng2,max(.5,wgt*sclR),sclR);
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
