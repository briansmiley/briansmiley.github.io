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
let trunkBase = 0;
let frameStart;
let TIMEOUT = 2000;
let TIMEDOUT = false;

function setup() {
  angleMode(DEGREES);
  createCanvas(700, 600);
  generateControls();
}


function generateControls() {
  controlPanel = new ControlPanel('main_controls');
  mouseMode = controlPanel.addCheckbox('Mouse mode (m)',false);
  slowModePanel = controlPanel.addPanel('slow_mode');
  slowMode = slowModePanel.addCheckbox('Single Render Mode', false);
  renderButton = slowModePanel.addButton('Render', false, slowMode);
  mouseMode = controlPanel.addCheckbox('Mouse mode (m)',false);
  scaleSlider = controlPanel.addTextboxSlider(0,.77,0.65,0.01,'Scale Factor<br>');
  angSlider = controlPanel.addTextboxSlider(0,180,25,.5,'Angle<br>','angle');
  minBranchSlider = controlPanel.addTextboxSlider(1,10,5,1,'Min Branch Size<br>');
  tiltSlider = controlPanel.addTextboxSlider(-90,90,0,.5,'Tilt<br>');
  lrSlider = controlPanel.addTextboxSlider(-1,1,0,.001,'L/R Shrink<br>')

}

function draw() {
  frameStart = millis();
  background(220);
  controlPanel.update();
  renderTree();

}

function renderTree() {
  sclL = scaleSlider.value();
  sclR = scaleSlider.value();
  let s = lrSlider.value();
  if (s > 0) sclR *= (1 - s);
  if (s < 0) sclL *= (1 + s);
  translate(width/2,height - trunkBase);
  let length = 180;
  if (mouseMode.checked()) {
    // mouseMap(lrSlider,mouseX);
    mouseMap(tiltSlider,mouseX);
    mouseMap(angSlider,mouseY);
  }
  // let angle = map(mouseY,0,height,0, PI);
  let angle = angSlider.value();

  function yesLoop() {
    loop();
  }


  branch(length,angle,15,scaleSlider.value());
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
      arc(0,-deltaY,end_width,end_width,0,180,PIE);
    }
    pop();
  }


function branch(len,ang,wgt,scl){
  //Break the recursion if the current frame has taken too long to render
  if (millis() - frameStart > TIMEOUT) {

    if (!TIMEDOUT) {
      let main = document.querySelector('main');
      console.log('Render timeout');
      message = createDiv('Render timed out; please refresh');
      message.id('timeout');
      // message.parent(main);
      main.children[1].before(message.elt);
      noLoop();
    }
    TIMEDOUT = true;
    return;
  }
  //Draw a branch tapering down to the enxt branch size or of constant weight
  strokeWeight(wgt)
  if (taper.checked()) {
    push();
    fill(0);
    noStroke();
    taperLine(0,0,0,-len,wgt,wgt*scl,true);
    pop();
    // gradientLine(0,0,0,-len,wgt,wgt*scl,12);
  }

  else line(0,0,0,-len);
  
  translate(0,-len);

  
  if(len >= minBranchSlider.value()){
    push();
    rotate(ang + tiltSlider.value());
    branch(sclL*len,ang,max(.1,wgt*sclL),sclL);
    pop()
    rotate(-ang + tiltSlider.value());
    branch(sclR*len,ang,max(.1,wgt*sclR),sclR);
  }
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
