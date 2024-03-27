class Ball {
    constructor(d, x, y, baseSpeed) {
        this.x = x;
        this.y = y;
        this.vel = [baseSpeed,baseSpeed];
        this.baseSpeed = baseSpeed;
        this.d = d;
        this.colr = 'white';
        this.immune = false;
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
    setSpeed(speed) {
        let current = this.getSpeed();
        let mult = speed/current;
        this.setVel(this.vel[0] * mult, this.vel[1]*mult);
        this.baseSpeed = speed;
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
            this.x = min(max(this.x, this.d/2), width - this.d/2);
            this.bounceX();
            wallSound.play();
        }
    }

    checkPaddleCollision(paddle) {
        //checks if the ball has just updated to being inside a paddle
        if (this.x - (this.d/2) < paddle.rightEdge() &&
            this.x + (this.d/2) > paddle.leftEdge() &&
            this.y - (this.d/2) < paddle.bottomEdge() &&
            this.y + (this.d/2) > paddle.topEdge() &&
            !this.immune) {
                this.bounceY();
                this.y = [paddle.bottomEdge() + this.d/2, paddle.topEdge() - this.d/2][paddle.player - 1];
                // this.immune = true;
                // boop.play();
                paddleSound.play();
            }

    }
    update(paddles) {
        //Move
        this.x += this.vel[0];
        this.y += this.vel[1];
        //Check for paddle collisions
        paddles.forEach((paddle) => this.checkPaddleCollision(paddle));
        this.checkWallCollisions()
        if (this.y > .33 * height && this.y < .66 * height) this.immune = false;
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