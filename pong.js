
let ball, paddle1, paddle2;
const ballFR = 5;
let score1, score2;
const MERLIN = false;

// // if (MERLIN)
// var slider1 = merlinSlider(0,43,1,21);
// var slider2 = merlinSlider(0,43,1,21);

//Else
let slider1, slider2;

function setup() {
    createCanvas(43,66);
    //Else
    slider1 = createSlider(0,width,width/2,1);
    slider2 = createSlider(0,width,width/2,1);
    game = new Game(7,2,2,2,3);
}

function draw() {
    background(0);
    game.update();
   
}
function value(slider) {
    return MERLIN ? slider : slider.value();
}

