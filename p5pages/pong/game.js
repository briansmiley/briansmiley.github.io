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
        this.ball.setSpeed(speed);
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

        this.ball.setSpeed(ballSpeedSlider.value());
        switch (this.mode) {
          case AUTOPLAY:
            this.paddles.forEach((paddle) => {
            paddle.update(scaledPerlinOffset(this.ball.x, this.ball.y, paddle.y, paddle.w, paddle.seed));
            slider1.value(this.paddle1.x)
            slider2.value(this.paddle2.x)
            });
            break;
          case SINGLE:
            this.paddle1.update(slider1.value());
            this.paddle2.update(scaledPerlinOffset(this.ball.x, this.ball.y, this.paddle2.y, this.paddle2.w, this.paddle2.seed));
            slider2.value(this.paddle2.x)
            break;
          case SLIDERS:
            this.paddle1.update(slider1.value());
            this.paddle2.update(slider2.value());
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
        this.ball.reset();
        this.paddles.forEach( (paddle) => paddle.reset());
        slider1.value()
    }
    playScoreSound(score) {
        if (score == 4) gameOverSound.play();
        else scoreSound.play();
    }
    checkScore() {
        if (this.ball.y - (this.ball.d/2) < this.paddleOffset/2) {
            this.ball.reset();
            this.playScoreSound(++this.score2);
        }
        if (this.ball.y + (this.ball.d/2) > (height - this.paddleOffset/2)) {
            this.ball.reset();
            this.playScoreSound(++this.score1);
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