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

    update() {
        //Check for wall collisions
        if (this.x <= this.d/2 || this.x >= width - this.d/2) {
            this.bounceX();
        }
        //Check for paddle collisions
        
        //Move
        this.x += vel[0];
        this.y += vel[1];
    }
    draw() {
        push();
        fill(this.colr);
        noStroke();
        circle(this.x,this.y,this.d);
        pop();
    }
}