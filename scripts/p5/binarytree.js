var sclL = .75;
var sclR = .75;
function setup() {
  createCanvas(900, 750);
}

function draw() {
  
  background(220);
  strokeWeight (6);
  translate(width/2,height);
  let length = 180;
  let angle = map(mouseY,0,height,0, PI);
  branch(length,angle,6);
}

function branch(len,ang,wgt){
  line(0,0,0,-len);
  translate(0,-len);
  strokeWeight(wgt)
  if(len >= 5){
    push();
    rotate(ang);
    branch(sclL*len,ang,max(.5,wgt*.7));
    pop()
    rotate(-ang);
    branch(sclR*len,ang,max(.5,wgt*.7));
  }
}
