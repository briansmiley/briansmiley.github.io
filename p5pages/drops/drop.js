class Drop {
    constructor(colr = randomColor(), speed = spreadRateSlider.value(), weight = rippleWeightSlider.value(), x = random(width), y = random(height), ) {
        this.x = x;
        this.y = y;
        this.colr = colr;
        this.r = 0;
        this.speed = speed;
        this.birth = millis();
        this.lifetime = rippleDurationSlider.value();
        this.weight = weight;
    }


    grow(step) {
        this.r += step;
    }
    fade() {
        push();
        colorMode(HSB);
        let age = millis() - this.birth;
        let bright = map(age, 0, this.lifetime, 100, 0);
        this.colr = [hue(this.colr),saturation(this.colr),bright];
        pop();
    }
    draw() {
        push();
        noFill()
        stroke(this.colr);
        strokeWeight(this.weight);
        circle(this.x, this.y, this.r * 2)
        pop();
    }
    frame() {
        this.draw();
        this.grow(this.speed);
        this.fade();
    }
}