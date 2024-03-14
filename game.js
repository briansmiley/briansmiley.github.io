class Game {
    constructor(paddleWidth = 7, paddleHeight = 2, ballSize = 2, ballSpeed = 3, paddleOffset = 2, ballFR = 1) {
        this.paddle1 = new Paddle(1,paddleWidth,paddleHeight,width/2,paddleOffset);
        this.paddle2 = new Paddle(2,paddleWidth,paddleHeight,width/2, height-paddleOffset);
        this.paddleOffset = paddleOffset;
        this.ball = new Ball(ballSize,width/2,height/2, ballSpeed);
        this.score1 = 0;
        this.score2 = 0;
        this.ballFR = ballFR;
        this.gameOver = false;
        this.gameOverTime = 0;
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
        this.paddle1.update(value(slider1));
        this.paddle2.update(value(slider2));
        
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
            rect(width/25, width/10 + (width/15 * i), width/25, width/25);
        }
        for (let i = 0; i < this.score2; i++) {
            rect(width/25, height - width/10 - (width/15 * i) - width/25, width/25, width/25);
        }
        pop();
        
    }
    resetScores() {
        this.score1 = 0;
        this.score2 = 0;
    }
}