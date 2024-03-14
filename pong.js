
let ball, paddle1, paddle2;
const ballFR = 5;
let score1, score2;
const MERLIN = false;
let paddleSize, paddleHeight, ballSize, ballSpeed, offset, fR;

// // if (MERLIN)
// var slider1 = merlinSlider(0,43,1,21);
// var slider2 = merlinSlider(0,43,1,21);

//Else
let slider1, slider2;

function setup() {
    // createCanvas(43,66);
    createCanvas(300,500);
    //Else
    slider1 = createSlider(0,width,width/2,1);
    slider2 = createSlider(0,width,width/2,1);
    // game = new Game(7,2,2,2,3);
    if (MERLIN) {
        paddleSize = 7;
        paddleHeight = 2;
        ballSize = 2;
        ballSpeed = 1;
        offset = 2;
        fR = 1;
    } else {
        paddleSize = 50;
        paddleHeight = 10;
        ballSize = 8;
        ballSpeed = 1;
        offset = 10;
        fR = 1;
    }
    game = new Game(paddleSize, paddleHeight, ballSize, ballSpeed, offset, fR);
}

function draw() {
    background(0);
    game.update();
   
}
function value(slider) {
    return MERLIN ? slider : slider.value();
}

