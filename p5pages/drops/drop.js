class Drop {
    constructor(colr = randomColor(), speed = spreadRateSlider.value(), weight = rippleWeightSlider.value(), x = random(width), y = random(height), ) {
        this.x = x;
        this.y = y;
        this.colr = colr;
        this.r = 0;
        this.speed = speed;
        this.birth = frameCount;
        this.lifetime = rippleDurationSlider.value();
        this.weight = weight;
        this.mirrors = {
            'N':false,
            'S':false,
            'E':false,
            'W':false
        }

    }

    mirrorN() {
        if (this.y - this.r < 0 && !this.mirrors['N']) {
            let refl = this.copy(this.x, -this.y);
            this.mirrors['N'] = true;
            refl.mirrors = {...this.mirrors};
            drops.push(refl);
        }
    }
    mirrorE() {
        if (this.x + this.r > width && !this.mirrors['E']) {
            let refl = this.copy((2 * width) - this.x, this.y);
            this.mirrors['E'] = true;
            refl.mirrors = {...this.mirrors};
            drops.push(refl);
        }
    }
    mirrorS() {
        if (this.y + this.r > height && !this.mirrors['S']) {
            let refl = this.copy(this.x, 2 * height - this.y);
            this.mirrors['S'] = true;
            refl.mirrors = {...this.mirrors};
            drops.push(refl);
        }
    }
    mirrorW() {
        if (this.x - this.r < 0 && !this.mirrors['W']) {
            let refl = this.copy(-this.x, this.y);
            this.mirrors['W'] = true;
            refl.mirrors = {...this.mirrors};
            drops.push(refl);
        }
    }
    reflections() {
        this.mirrorN();
        this.mirrorE();
        this.mirrorS();
        this.mirrorW();
    }
    copy(newX, newY) {
        let d = new Drop(this.colr, this.speed, this.weight, newX, newY);
        d.r = this.r;
        d.birth = this.birth;
        d.lifetime = this.lifetime;
        d.weight = this.weight;
        return d;
    }
    grow(step) {
        this.r += step;
    }
    fade() {
        push();
        colorMode(HSB);
        let age = frameCount - this.birth;
        let bright = map(age, 0, this.lifetime, 100, 0);
        let alph = map(age, 0, this.lifetime, 1, 0);
        this.colr = color([hue(this.colr),saturation(this.colr),brightness(this.colr),alph]);
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