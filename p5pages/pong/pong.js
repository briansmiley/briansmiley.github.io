
let game, ball, paddle1, paddle2;
let score1, score2;
let paddleSize, paddleHeight, ballSize, ballSpeed, offset;
let singlePlayer = false;
const AUTOPLAY = 'Auto';
const SLIDERS = 'Two-player';
const SINGLE = 'Single-player';
let boop, paddleSound, wallSound, scoreSound;

let MODE, MODESELECT;
let slider1, slider2;
let resetButton, pausePlayButton;
let ballSpeedSlider;

function setup() {
    boop = loadSound('./sounds/beep.wav');
    paddleSound = loadSound('./sounds/paddle.wav');
    wallSound = loadSound('./sounds/wall.wav');
    scoreSound = loadSound('./sounds/score.wav')
    gameOverSound = loadSound('./sounds/gameover.wav');

    let canvas = createCanvas(300,500);
    canvas.parent('canvas-box');

    paddleSize = 50;
    paddleHeight = 10;
    ballSize = 8;
    ballSpeed = 3;
    offset = 10;

    game = new Game(paddleSize, paddleHeight, ballSize, ballSpeed, offset, MODE);
    generateControls();
    game.paddle1.control(slider1);
    game.paddle2.control(slider2);
    game.ball.speedSlider(ballSpeedSlider);
    noLoop();
}
function generateControls() {
    MODESELECT = createSelect();
    MODESELECT.parent('mode-select-container');
    [AUTOPLAY,SLIDERS,SINGLE].forEach((option) => MODESELECT.option(option));
    
    slider1 = createSlider(0,width,width/2,1);
    slider2 = createSlider(0,width,width/2,1);
    slider1.parent('player1-container');
    slider2.parent('player2-container');
    slider1.class('paddle-slider');
    slider2.class('paddle-slider');
    
    resetButton = createButton('Reset');
    resetButton.parent('reset-button-container');
    resetButton.mousePressed(() => {
        game.endGame();
        draw();
    });

    pausePlayButton = createButton('Play');
    pausePlayButton.parent('pause-button-container');
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

    ballSpeedSlider = createSlider(1, 20, ballSpeed, 0.25);
    ballSpeedSlider.parent('ball-slider-container');
    ballSpeedSlider.id('ball-slider')

}
function scaledPerlinOffset(ballX, ballY, paddleY, paddleWidth, paddleSeed) {
  
  let ballDistance = abs(ballY - paddleY);
  
  push();
  noiseSeed(paddleSeed);
  let n = noise(millis()/1000);
  pop();
  let perlinX = n * width;
  let paddleX = (ballX * (1 - ballDistance/height)) + (perlinX * (0.15 + ballDistance/height));
  
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
