
let ball, paddle1, paddle2;
let score1, score2;
let MERLIN = true;
let paddleSize, paddleHeight, ballSize, ballSpeed, offset, fR;
let singlePlayer = false;
const AUTOPLAY = 'Auto';
const SLIDERS = 'Two-player';
const SINGLE = 'Single-player';
// // if (MERLIN)
var MODE = merlinDropdown(['Auto', 'Two-Player', 'Single-player'], 'Auto');
var slider1 = merlinSlider(0,43,21,1);
var slider2 = merlinSlider(0,43,21,1);
var ballSpeedSlider = merlinSlider(.1,2,1,.1);

//Else
// let MODE, MODESELECT;
// let slider1, slider2;

function setup() {
    createCanvas(43,66);
    //Else
    // MODESELECT = createSelect();
    // [AUTOPLAY,SLIDERS,SINGLE].forEach((option) => MODESELECT.option(option));
    // createCanvas(300,500);
    // slider1 = createSlider(0,width,width/2,1);
    // slider2 = createSlider(0,width,width/2,1);
    if (MERLIN) {
        paddleSize = 7;
        paddleHeight = 2;
        ballSize = 2;
        ballSpeed = 1;
        offset = 2;
        fR = 1;
      //test
    } else {
        paddleSize = 50;
        paddleHeight = 10;
        ballSize = 8;
        ballSpeed = 3;
        offset = 10;
        fR = 1;
    }
    game = new Game(paddleSize, paddleHeight, ballSize, ballSpeed, offset, fR, MODE);
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
    // MODE = MODESELECT.value();
    game.ballSpeed(ballSpeedSlider);
    game.setMode(MODE);
    game.update();
}
function value(slider) {
    return MERLIN ? slider : slider.value();
}

class Game {
    constructor(paddleWidth = 7, paddleHeight = 2, ballSize = 2, ballSpeed = 3, paddleOffset = 2, ballFR = 1, mode = AUTOPLAY) {
        this.paddle1 = new Paddle(1,paddleWidth,paddleHeight,width/2,paddleOffset, random());
        this.paddle2 = new Paddle(2,paddleWidth,paddleHeight,width/2, height-paddleOffset, random() * 2000);
        this.paddles = [this.paddle1, this.paddle2];
        this.paddleOffset = paddleOffset;
        this.ball = new Ball(ballSize,width/2,height/2, ballSpeed);
        this.score1 = 0;
        this.score2 = 0;
        this.ballFR = ballFR;
        this.gameOver = false;
        this.gameOverTime = 0;
        this.mode = mode;
    }
    ballSpeed(speed) {
        this.ball.baseSpeed = speed;
    }
    update() {
        if (this.gameOver) {
            this.drawElements();
            if (millis() - this.gameOverTime > 5000) {
                this.resetScores();
                this.gameOver = false;
            }
            return;
        }
        switch (this.mode) {
          case AUTOPLAY:
            this.paddles.forEach((paddle) => {
            paddle.update(scaledPerlinOffset(this.ball.x, this.ball.y, paddle.y, paddle.w, paddle.seed))});
            break;
          case SINGLE:
            this.paddle1.update(value(slider1));
            this.paddle2.update(scaledPerlinOffset(this.ball.x, this.ball.y, this.paddle2.y, this.paddle2.w, this.paddle2.seed));
            break;
          case SLIDERS:
            this.paddle1.update(value(slider1));
            this.paddle2.update(value(slider2));
            break;
      }
        
        if (frameCount % this.ballFR == 0) this.ball.update([this.paddle1,this.paddle2]);
        this.drawElements();
        this.checkScore();
        if (max(this.score1,this.score2) > 3) this.endGame();
    }
    drawElements() {
        this.paddle1.draw();
        this.paddle2.draw()
        this.ball.draw();
        this.displayScores();
    }
    endGame() {
        if (!this.gameOver) this.gameOverTime = millis();
        this.gameOver = true;
    }
    checkScore() {
        if (this.ball.y - (this.ball.d/2) < this.paddleOffset/2) {
            this.ball.reset();
            this.score2++;
        }
        if (this.ball.y + (this.ball.d/2) > (height - this.paddleOffset/2)) {
            this.ball.reset();
            this.score1++
        }
    }
    displayScores() {
        push();
        noStroke();
        fill(175);
        for (let i = 0; i < this.score1; i++) {
            rect(width/15, width/8 + (width/12 * i), width/25, width/25);
        }
        for (let i = 0; i < this.score2; i++) {
            rect(width/15, height - width/8 - (width/12 * i) - width/25, width/25, width/25);
        }
        pop();
        
    }
    setMode(mode) {
      this.mode = mode;
    }
    resetScores() {
        this.score1 = 0;
        this.score2 = 0;
    }
}


class Ball {
    constructor(d, x, y, baseSpeed) {
        this.x = x;
        this.y = y;
        this.vel = [baseSpeed,baseSpeed];
        this.baseSpeed = baseSpeed;
        this.d = d;
        this.colr = 'white';
    }

    setColr(c) {
        this.colr = c;
    }

    setPos(x,y) {
        this.x = x;
        this.y = y;
    }

    setVel(vx,vy) {
        this.vel = [vx,vy];
    }

    getSpeed() {
        return Math.sqrt(this.vel[1]**2 + this.vel[0]**2);
    }

    bounceX() {
        this.vel = [-this.vel[0],this.vel[1]];
    }
    bounceY() {
        this.vel = [this.vel[0],-this.vel[1]];
    }
    reset() {
        this.setPos(width/2, height/2);
        //set the ball moving in a random of 4 directions
        this.vel = [random([-this.baseSpeed,this.baseSpeed]),random([-this.baseSpeed,this.baseSpeed])];
    }
    checkWallCollisions() {
        if (this.x <= this.d/2 || this.x >= width - this.d/2) {
            this.bounceX();
        }
    }

    checkPaddleCollision(paddle) {
        //checks if the ball has just updated to being inside a paddle
        if (this.x - (this.d/2) < paddle.rightEdge() &&
            this.x + (this.d/2) > paddle.leftEdge() &&
            this.y - (this.d/2) < paddle.bottomEdge() &&
            this.y + (this.d/2) > paddle.topEdge()) {
                this.bounceY();
            }
    }
    update(paddles) {
        this.checkWallCollisions()
        //Check for paddle collisions
        paddles.forEach((paddle) => this.checkPaddleCollision(paddle));
        //Move
        this.x += this.vel[0];
        this.y += this.vel[1];
    }
    draw() {
        push();
        rectMode(CENTER);
        fill(this.colr);
        noStroke();
        rect(this.x,this.y,this.d,this.d);
        pop();
    }
}

class Paddle {
    constructor(player, w, h, x, y, seed, colr = 175, speed = 1) {
        this.w = w;
        this.h = h;
        this.player = player;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.colr = colr
        this.padding = 0;
        this.seed = seed;
    }

    moveLeft(){
        this.x = max(this.x - this.speed, this.w/2);
    }
    moveRight() {
        this.x = min(width - this.w/2, this.x + this.speed);
    }
    leftEdge() {
        return this.x - this.w/2;
    }
    rightEdge() {
        return this.x + this.w/2;
    }
    topEdge() {
        return this.y - this.h/2;
    }
    bottomEdge() {
        return this.y + this.h/2;
    }
    update(pos) {
        this.x = pos;
    }
    setColor(colr) {
        this.colr = colr;
    }

    //Set the offset between the paddle and the edge of the board
    pad(dist) {
        this.padding = dist;
    }
    draw() {
        let x = this.x;
        let y = this.y;
        push()
        rectMode(CENTER);
        fill(this.colr)
        noStroke();
        rect(x, y, this.w, this.h);
        pop();
    }
}