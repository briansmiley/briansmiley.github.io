class Game {
    constructor(paddleWidth = 7, paddleHeight = 2, ballSize = 2, ballFR = 5) {
        this.paddle1 = new Paddle(1,paddleWidth,paddleHeight,width/2,2);
        this.paddle2 = new Paddle(2,paddleWidth,paddleHeight,width/2, height-2);
        this.ball = new Ball(ballSize,width/2,height/2,1,1);
        this.score1 = 0;
        this.score2 = 0;
        this.ballFR = ballFR;
    }

    update() {
        this.paddle1.update(value(slider1));
        this.paddle2.update(value(slider2));
        if (frameCount % this.ballFR == 0) this.ball.update([this.paddle1,this.paddle2]);
    
        this.paddle1.draw();
        this.paddle2.draw()
        this.ball.draw();
        switch (this.ball.checkScore()) {
            case 0:
                break;
            case 1:
                this.score1++
                break;
            case 2:
                this.score2++
                break;
        }
    }
}