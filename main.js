const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const halfWidth = canvas.width / 2;
const startButton = document.getElementById("startButton");
const LeftCircle1Slider = document.getElementById("LeftCircle1Slider");
const RightCircle1Slider = document.getElementById("RightCircle1Slider");
const LeftCircle2Slider = document.getElementById("LeftCircle2Slider");
const RightCircle2Slider = document.getElementById("RightCircle2Slider");

let circles = [];
let circles1 = [];
let circles2 = [];

var start = false;
var chain = 0;

class Circle {
    constructor(xpos, ypos, mass, radius, color, xvel, yvel, type, index) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.xvel = xvel;
        this.yvel = yvel;
        this.type = type;
        this.index = index;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.arc(this.xpos, this.ypos, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        //ctx.fillText(this.index, this.xpos, this.ypos);
        ctx.closePath();
    }

    updatev1x(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        let num1 = (2 * m2) / (m1 + m2);
        let num2 = (v1x - v2x) * (x1x - x2x) + (v1y - v2y) * (x1y - x2y);
        let num2_ = (Math.pow(x1x - x2x, 2) + Math.pow(x1y - x2y, 2));
        let num3 = (x1x - x2x);

        return v1x - num1 * (num2 / num2_) * num3;
    }

    updatev1y(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        let num1 = (2 * m2) / (m1 + m2);
        let num2 = (v1x - v2x) * (x1x - x2x) + (v1y - v2y) * (x1y - x2y);
        let num2_ = (Math.pow(x1x - x2x, 2) + Math.pow(x1y - x2y, 2));
        let num3 = (x1y - x2y);

        return v1y - num1 * (num2 / num2_) * num3;
    }

    updatev2x(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        let num1 = (2 * m1) / (m1 + m2);
        let num2 = (v2x - v1x) * (x2x - x1x) + (v2y - v1y) * (x2y - x1y);
        let num2_ = Math.pow(x2x - x1x, 2) + Math.pow(x2y - x1y, 2);
        let num3 = (x2x - x1x);

        return v2x - num1 * (num2 / num2_) * num3;
    }

    updatev2y(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        let num1 = (2 * m1) / (m1 + m2);
        let num2 = (v2x - v1x) * (x2x - x1x) + (v2y - v1y) * (x2y - x1y);
        let num2_ = Math.pow(x2x - x1x, 2) + Math.pow(x2y - x1y, 2);
        let num3 = (x2y - x1y);

        return v2y - num1 * (num2 / num2_) * num3;
    }

    updateVelocity(m1, m2, v1, v2) {
        /**Formula if each mass keeps their own kinetic energy **/
        var v = 0;

        var known_KE = 0.5 * (m1 * Math.pow(v1, 2) + m2 * Math.pow(v2, 2));
        var known_p = m1 * v1 + m2 * v2;

        var a = (m2 / 2) * (Math.pow((m1 / m2), 2)) + (m1 / 2);
        var b = -m2 * (known_p / m2) * (m1 / m2);
        var c = (m2 / 2) * Math.pow((known_p / m2), 2) - known_KE;

        if((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a) == v1) {
            v = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        }
        else {
            v = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        }

        return v;
    }

    updateVelocities(circle1, circle2) {
        /** Corresponding code for the 2-D collisions **/
        circle1.xvel = circle1.updatev1x(circle1.mass, circle2.mass, circle1.xvel, circle1.yvel, circle2.xvel, circle2.yvel, circle1.xpos, circle1.ypos, circle2.xpos, circle2.ypos);
        circle1.yvel = circle1.updatev1y(circle1.mass, circle2.mass, circle1.xvel, circle1.yvel, circle2.xvel, circle2.yvel, circle1.xpos, circle1.ypos, circle2.xpos, circle2.ypos);
        circle2.xvel = circle1.updatev2x(circle1.mass, circle2.mass, circle1.xvel, circle1.yvel, circle2.xvel, circle2.yvel, circle1.xpos, circle1.ypos, circle2.xpos, circle2.ypos);
        circle2.yvel = circle1.updatev2y(circle1.mass, circle2.mass, circle1.xvel, circle1.yvel, circle2.xvel, circle2.yvel, circle1.xpos, circle1.ypos, circle2.xpos, circle2.ypos);
        
       
        /**Corresponding code for the 1-D collisions / updateVelocity() function **
        var tempX = circle1.xvel;
        var tempY = circle1.yvel;

        circle1.xvel = circle1.updateVelocity(circle1.mass, circle2.mass, circle1.xvel, circle2.xvel);
        circle1.yvel = circle1.updateVelocity(circle1.mass, circle2.mass, circle1.yvel, circle2.yvel);
        circle2.xvel = ((circle1.mass * tempX + circle2.mass * circle2.xvel) - (circle1.mass * circle1.xvel)) / circle2.mass;
        circle2.yvel = ((circle1.mass * tempY + circle2.mass * circle2.yvel) - (circle1.mass * circle1.yvel)) / circle2.mass;
        **/
    }

    updateCollisionWithWall() {
        if(this.xpos + this.radius + this.xvel >= canvas.width || this.xpos - this.radius + this.xvel < 0) {
            this.xvel = -this.xvel;
        }
        if(this.ypos + this.radius + this.yvel > canvas.height || this.ypos - this.radius + this.yvel < 0) {
            this.yvel = -this.yvel;
        }

        if(this.index < circles1.length) {
            if(this.xpos < halfWidth) {
                if(this.xpos + this.radius + this.xvel >= halfWidth) {
                    this.xvel = -this.xvel;
                }
            }
            else if(this.xpos > halfWidth) {
                if(this.xpos - this.radius + this.xvel <= halfWidth) {
                    this.xvel = -this.xvel;
                }
            }
        }
    }

    willCollide(circle1, circle2) { //willCollide() checks if circle1 and circle2 will collide in the next time step
        if(Math.sqrt(Math.pow(circle1.xpos + circle1.xvel - (circle2.xpos + circle2.xvel), 2) + Math.pow(circle1.ypos + circle1.yvel - (circle2.ypos + circle2.yvel), 2)) < (circle1.radius + circle2.radius)) {
            return true;
        }

        return false;
    }

    willChainCollide(circle1, circle2) { //willChainCollide() checks if circle1 will collide with OTHER circles after it has collided with circle2
        for(var i = 0; i < circles.length; i++) {
            if(circle1.index != i && circle2.index != i) {
                if(circle1.willCollide(circle1, circles[i]) && chain < 50) {
                    circles[i].updateCollisionWithObj();
                }
            }
        }
    }

    isCollided(circle1, circle2) { //isCollided() checks if circle1 and circle2 are collided in the current time step
        if(Math.sqrt(Math.pow(circle1.xpos - circle2.xpos, 2) + Math.pow(circle1.ypos - circle2.ypos, 2)) < circle1.radius + circle2.radius) {
            return true;
        }

        return false;
    }

    updateUntilCollided(circle1, circle2) { //updateUntilCollided() accurately updates the positions of two circles that WILL collide right before they really DO collide
        if(!this.isCollided(circle1, circle2)) { //this is necessary because with the current code, circles can get stuck and overlap with each other
            var xpos1 = circle1.xpos;
            var ypos1 = circle1.ypos;
            var xpos2 = circle2.xpos;
            var ypos2 = circle2.ypos;
            var r1 = circle1.radius;
            var r2 = circle2.radius;
            var xRatio = circle1.xvel / circle2.xvel;
            var yRatio = circle1.yvel / circle2.yvel;
            var vel1Ratio = circle1.xvel / circle1.yvel;
            var vel2Ratio = circle2.xvel / circle2.yvel;

            console.log(xpos1 + "/" + ypos1 + "/" + xpos2 + "/" + ypos2);
            console.log(circle1.xvel + "/" + circle1.yvel + "/" + circle2.xvel + "/" + circle2.yvel);
            
            var a = Math.pow(vel2Ratio, 2) * Math.pow(xRatio - 1, 2) + Math.pow(yRatio - 1, 2);
            var b = 2 * (ypos1 - ypos2) * (yRatio - 1) + 2 * (xpos1 - xpos2) * (vel2Ratio) * (xRatio - 1);
            var c = Math.pow(xpos1 - xpos2, 2) + Math.pow(ypos1 - ypos2, 2) - Math.pow(r1 + r2, 2);

            var v2y = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
            var v2x = v2y * vel2Ratio;
            var v1y = v2y * yRatio;
            var v1x = v1y * vel1Ratio;

            /**console.log("v1x: " + v1x);
            console.log("v1y: " + v1y);
            console.log("v2x: " + v2x);
            console.log("v2y: " + v2y);
            **/

            if(Math.pow(circle1.xvel + circle1.yvel, 2) < Math.pow(v1x + v1y, 2)) {
                v2y = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
                v2x = v2y * vel2Ratio;
                v1y = v2y * yRatio;
                v1x = v1y * vel1Ratio;
                
                /**console.log("v1x: " + v1x);
                console.log("v1y: " + v1y);
                console.log("v2x: " + v2x);
                console.log("v2y: " + v2y);
                **/
            }

            circle1.xpos += v1x;
            circle1.ypos += v1y;
            circle2.xpos += v2x;
            circle2.ypos += v2y;
        }
    }

    updateCollisionWithObj() {
        for(var j = 0; j < circles.length; j++) {
            if(this.index != j) {
                if(this.willCollide(this, circles[j])) {
                    if((this.xvel - circles[j].xvel) * (this.xpos - circles[j].xpos) + (this.yvel - circles[j].yvel) * (this.ypos - circles[j].ypos) < 0) {
                        this.updateUntilCollided(this, circles[j]);
                        this.updateVelocities(this, circles[j]);

                        /**checks for collisions afterwards (for example, a circle could be pushed into another circle that's already been looped through) 
                         * if there are extra collisions, then this function will be run again to calculate velocities of affected circles
                         * FOR TOMORROW: when willCollide() runs again, it needs to use new positions, i.g. create temporary future positions
                        */
                        chain++;

                        this.willChainCollide(this, circles[j]);
                        this.willChainCollide(circles[j], this);
                    }
                }
            }
        }
    }

    updatePosition() {
        this.xpos += this.xvel;
        this.ypos += this.yvel;
        
        chain = 0;
    }
}

function createCircles() {
    circles = [];
    circles1 = [];
    circles2 = [];

    const numCircle1 = parseInt(LeftCircle1Slider.value) + parseInt(RightCircle1Slider.value);
    const numCircle2 = parseInt(LeftCircle2Slider.value) + parseInt(RightCircle2Slider.value);
    var a = 0;
    var b = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(halfWidth, 0);
        ctx.lineTo(halfWidth, canvas.height);
        ctx.closePath();
        ctx.strokeStyle = "#000000";
        ctx.stroke();

    while(circles1.length < numCircle1) {
        var radius = 12; 
        var mass = Math.pow(radius, 3) / 100; 
        var x = Math.random() * (canvas.width - 2 * radius) + radius;
        var y = Math.random() * (canvas.height - 2 * radius) + radius;
        var dx = (Math.random() * 1 - 0.5);
        var dy = (Math.random() * 1 - 0.5);
        var color = "#3278cf";
        var overlapping = false;

        for(var i = 0; i < circles1.length; i++) {
            if(!(a == i)) {
                if(Math.sqrt(Math.pow(circles1[i].xpos - x, 2) + Math.pow(circles1[i].ypos - y, 2)) < circles1[i].radius + radius) {
                    overlapping = true;
                }
            }
        }

        if(isOverlappingWithMembrane(x, radius)) {
            overlapping = true;
        }

        if(a < LeftCircle1Slider.value) {
            if(!overlapping && x + radius < halfWidth) {
                circles1[a] = new Circle(x, y, mass, radius, color, dx, dy, "circle1", a);
                circles1[a].draw(ctx);
                a++;
            }
        }
        else {
            if(!overlapping && x - radius > halfWidth) {
                circles1[a] = new Circle(x, y, mass, radius, color, dx, dy, "circle1", a);
                circles1[a].draw(ctx);
                a++;
            }
        }
    }

    while(circles2.length < numCircle2) {
        var radius = 6; 
        var mass = Math.pow(radius, 3) / 100;
        var x = Math.random() * (canvas.width - 2 * radius) + radius;
        var y = Math.random() * (canvas.height - 2 * radius) + radius;
        var dx = (Math.random() * 2 - 1);
        var dy = (Math.random() * 2 - 1);
        var color = "#06254d";
        var overlapping = false;

        for(var i = 0; i < circles1.length; i++) {
            if(Math.sqrt(Math.pow(circles1[i].xpos - x, 2) + Math.pow(circles1[i].ypos - y, 2)) < circles1[i].radius + radius) {
                overlapping = true;
            }
        }

        for(var i = 0; i < circles2.length; i++) {
            if(!(b == i)) {
                if(Math.sqrt(Math.pow(circles2[i].xpos - x, 2) + Math.pow(circles2[i].ypos - y, 2)) < circles2[i].radius + radius) {
                    overlapping = true;
                }
            }
        }

        if(isOverlappingWithMembrane(x, radius)) {
            overlapping = true;
        }

        if(b < LeftCircle2Slider.value) {
            if(!overlapping && x + radius < halfWidth) {
                var indexCon = b + a;
                circles2[b] = new Circle(x, y, mass, radius, color, dx, dy, "circle2", indexCon);
                circles2[b].draw(ctx);
                b++;
            }
        }
        else {
            if(!overlapping && x - radius > halfWidth) {
                var indexCon = b + a;
                circles2[b] = new Circle(x, y, mass, radius, color, dx, dy, "circle2", indexCon);
                circles2[b].draw(ctx);
                b++;
            }
        }
    }

    circles.push(...circles1, ...circles2);
}

function isOverlappingWithMembrane(x, radius) {
    if(x < halfWidth) {
        if(x + radius > halfWidth) {
            return true;
        }
    }
    else if(x > halfWidth) {
        if(x - radius < halfWidth) {
            return true;
        }
    }
}

function updateCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(halfWidth, 0);
    ctx.lineTo(halfWidth, canvas.height);
    ctx.closePath();
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    for(var i = 0; i < circles.length; i++) {
        circles[i].updateCollisionWithWall();
        circles[i].updateCollisionWithObj();
        circles[i].updateCollisionWithWall();
        circles[i].updatePosition();
        circles[i].draw(ctx);
    }

    countConcentration();
    
    if(start) {
        requestAnimationFrame(updateCircles);
    }
}

function countConcentration() {
    let soluteLcount = 0;
    let solventLcount = 0;
    let soluteRcount = 0;
    let solventRcount = 0;

    //circle2[] contains the smaller circles
    for(var i = 0; i < circles2.length; i++) {
        if(circles2[i].xpos < halfWidth) {
            solventLcount++;
        }
        else if(circles2[i].xpos > halfWidth) {
            solventRcount++;
        }
    }

    //circle1[] contains the bigger circles
    for(var i = 0; i < circles1.length; i++) {
        if(circles1[i].xpos < halfWidth) {
            soluteLcount++;
        }
        else if(circles1[i].xpos > halfWidth) {
            soluteRcount++;
        }
    }

    let concentrationL = (soluteLcount / solventLcount).toFixed(4);
    let concentrationR = (soluteRcount / solventRcount).toFixed(4);

    ctx.fillText("Concentration: " + concentrationL, 0, 25);
    ctx.fillText("Concentration: " + concentrationR, halfWidth, 25);
    
}

LeftCircle1Slider.onchange = function() {
    createCircles();
}

RightCircle1Slider.onchange = function() {
    createCircles();
}

LeftCircle2Slider.onchange = function() {
    createCircles();
}

RightCircle2Slider.onchange = function() {
    createCircles();
}

startButton.onclick = function() {
    start = !start;
    if(start) {
        startButton.innerText = "Pause";
    }
    else {
        startButton.innerText = "Start";
    }
    updateCircles();
}
