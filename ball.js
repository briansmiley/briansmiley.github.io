class Ball {
    constructor(d, x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vel = [vx,vy];
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

    speed() {
        return Math.sqrt(this.vel[1]**2 + this.vel[0]**2);
    }

    bounceX() {
        this.vel = [-this.vel[0],this.vel[1]];
    }
    bounceY() {
        this.vel = [this.vel[0],-this.vel[1]];
    }
    reset() {
        this.x = width/2;
        this.y = height/2;
        //set the ball moving in a random of 4 directions
        this.vel = [random([-1,1]),random([-1,1])];
    }
    checkWallCollisions() {
        if (this.x <= this.d/2 || this.x >= width - this.d/2) {
            this.bounceX();
        }
    }
    checkScore() {
        if (this.y - this.d/2 <= 0) {
            this.reset();
            return 2;
        }
        if (this.y + this.d/2 >= height) {
            this.reset();
            return 1;
        }
        return 0
    }
    checkPaddleCollision(paddle) {
        //checks if the ball has just updated to being inside a paddle
        if (this.x - this.d/2 <= paddle.rightEdge() &&
            this.x + this.d/2 >= paddle.leftEdge() &&
            this.y - this.d/2 <= paddle.bottomEdge() &&
            this.y + this.d/2 >= paddle.topEdge()) {
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