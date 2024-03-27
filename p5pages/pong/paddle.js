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
        this.slider;
    }
    reset() {
        this.x = width/2;
        this.slider.value(this.x);
    }
    control(slider) {
        this.slider = slider;
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