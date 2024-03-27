
let game, ball, paddle1, paddle2;
let score1, score2;
let MERLIN = false;
let paddleSize, paddleHeight, ballSize, ballSpeed, offset, fR;
let singlePlayer = false;
const AUTOPLAY = 'Auto';
const SLIDERS = 'Two-player';
const SINGLE = 'Single-player';
let boop, paddleSound, wallSound, scoreSound;
// // if (MERLIN)
// var MODE = merlinDropdown([AUTOPLAY, SLIDERS, SINGLE], AUTOPLAY);
// var slider1 = merlinSlider(0,43,21,1);
// var slider2 = merlinSlider(0,43,21,1);

//Else
let MODE, MODESELECT;
let slider1, slider2;
let resetButton, pausePlayButton;

function setup() {
    boop = loadSound('./sounds/beep.wav');
    paddleSound = loadSound('./sounds/paddle.wav');
    wallSound = loadSound('./sounds/wall.wav');
    scoreSound = loadSound('./sounds/score.wav')
    gameOverSound = loadSound('./sounds/gameover.wav');


    // createCanvas(43,66);
    //Else
    let canvas = createCanvas(300,500);
    canvas.parent('canvas-box');
    
    // game = new Game(7,2,2,2,3);
    // MERLIN = true;
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
        ballSpeed = 3;
        offset = 10;
        fR = 1;
    }
    // MERLIN = false;
    game = new Game(paddleSize, paddleHeight, ballSize, ballSpeed, offset, fR, MODE);
    generateControls();
    noLoop();
}
function generateControls() {
    MODESELECT = createSelect();
    MODESELECT.parent('mode-select');
    [AUTOPLAY,SLIDERS,SINGLE].forEach((option) => MODESELECT.option(option));
    
    slider1 = createSlider(0,width,width/2,1);
    slider2 = createSlider(0,width,width/2,1);
    resetButton = createButton('Reset');
    resetButton.parent('reset-button');
    resetButton.mousePressed(() => {
        game.endGame();
        draw();
    });
    pausePlayButton = createButton('Play');
    pausePlayButton.parent('pause-button');
    pausePlayButton.mousePressed(() => {
        if (isLooping()) {
            noLoop();
            pausePlayButton.html('Play');
        }
        else {
            loop();
            pausePlayButton.html('Pause');
        }
    });
    slider1.parent('player1');
    slider2.parent('player2');
    slider1.class('paddle-slider');
    slider2.class('paddle-slider');
}
function scaledPerlinOffset(ballX, ballY, paddleY, paddleWidth, paddleSeed) {
  
  let ballDistance = abs(ballY - paddleY);
  
  push();
  noiseSeed(paddleSeed);
  let n = noise(millis()/1000);
  pop();
  let perlinX = n * width;
  let paddleX = (ballX * (1 - ballDistance/height)) + (perlinX * (0.18 + ballDistance/height));
  
  // let offsetRange = (n - 0.5) * paddleWidth;
  // let scaledOffset = map(ballDistance, 0, height, offsetRange * 2, offsetRange * 10);
  return min(max(0, paddleX),width);
}
function draw() {
    background(0);
    MODE = MODESELECT.value();
    game.setMode(MODE);
    game.update();

}
function value(slider) {
    return MERLIN ? slider : slider.value();
}