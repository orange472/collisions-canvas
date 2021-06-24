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
        ctx.closePath();
    }

    getIndex() {
        return this.index;
    }

    updatev1x(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        //v1 - v2 = [v1x - v2x, v1y - v2y]
        //x1 - x2 = [x1x - x2x, x1y - x2y]

        let num1 = (2 * m2) / (m1 + m2);
        let num2 = (v1x - v2x) * (x1x - x2x) + (v1y - v2y) * (x1y - x2y);
        let num2_ = Math.pow(Math.sqrt(Math.pow(x1x - x2x, 2) + Math.pow(x1y - x2y, 2)), 2);
        let num3 = (x1x - x2x);

        return v1x - num1 * (num2 / num2_) * num3;

        /** Formula if each mass keeps their own kinetic energy **
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
        **/
    }

    updatev1y(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        let num1 = (2 * m2) / (m1 + m2);
        let num2 = (v1x - v2x) * (x1x - x2x) + (v1y - v2y) * (x1y - x2y);
        let num2_ = Math.pow(Math.sqrt(Math.pow(x1x - x2x, 2) + Math.pow(x1y - x2y, 2)), 2);
        let num3 = (x1y - x2y);

        return v1y - num1 * (num2 / num2_) * num3;
    }

    updatev2x(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        //v2 - v1 = [v2x - v1x, v2y - v1y]
        //x2 - x1 = [x2x - x1x, x2y - x1y]

        let num1 = (2 * m1) / (m1 + m2);
        let num2 = (v2x - v1x) * (x2x - x1x) + (v2y - v1y) * (x2y - x1y);
        let num2_ = Math.pow(Math.sqrt(Math.pow(x2x - x1x, 2) + Math.pow(x2y - x1y, 2)), 2);
        let num3 = (x2x - x1x);

        return v2x - num1 * (num2 / num2_) * num3;
    }

    updatev2y(m1, m2, v1x, v1y, v2x, v2y, x1x, x1y, x2x, x2y) {
        let num1 = (2 * m1) / (m1 + m2);
        let num2 = (v2x - v1x) * (x2x - x1x) + (v2y - v1y) * (x2y - x1y);
        let num2_ = Math.pow(Math.sqrt(Math.pow(x2x - x1x, 2) + Math.pow(x2y - x1y, 2)), 2);
        let num3 = (x2y - x1y);

        return v2y - num1 * (num2 / num2_) * num3;
    }

    updatePosition() {
        for(var j = 0; j < circles.length; j++) {
            if(!(this.index == j)) {
                if(Math.sqrt(Math.pow(this.xpos - circles[j].xpos + this.xvel - circles[j].xvel, 2) + Math.pow(this.ypos - circles[j].ypos + this.yvel - circles[j].yvel, 2)) < (this.radius + circles[j].radius)) {
                    this.xvel = this.updatev1x(this.mass, circles[j].mass, this.xvel, this.yvel, circles[j].xvel, circles[j].yvel, this.xpos, this.ypos, circles[j].xpos, circles[j].ypos);
                    this.yvel = this.updatev1y(this.mass, circles[j].mass, this.xvel, this.yvel, circles[j].xvel, circles[j].yvel, this.xpos, this.ypos, circles[j].xpos, circles[j].ypos);
                    circles[j].xvel = this.updatev2x(this.mass, circles[j].mass, this.xvel, this.yvel, circles[j].xvel, circles[j].yvel, this.xpos, this.ypos, circles[j].xpos, circles[j].ypos);
                    circles[j].yvel = this.updatev2y(this.mass, circles[j].mass, this.xvel, this.yvel, circles[j].xvel, circles[j].yvel, this.xpos, this.ypos, circles[j].xpos, circles[j].ypos);

                    /**var tempX = this.xvel;
                    var tempY = this.yvel;

                    this.xvel = this.updateVelocity(this.mass, circles[j].mass, this.xvel, circles[j].xvel);
                    this.yvel = this.updateVelocity(this.mass, circles[j].mass, this.yvel, circles[j].yvel);
                    circles[j].xvel = ((this.mass * tempX + circles[j].mass * circles[j].xvel) - (this.mass * this.xvel)) / circles[j].mass;
                    circles[j].yvel = ((this.mass * tempY + circles[j].mass * circles[j].yvel) - (this.mass * this.yvel)) / circles[j].mass;
                    **/
                }
            }
        }

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

        this.xpos += this.xvel;
        this.ypos += this.yvel;

        this.draw(ctx);
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
        var radius = 4; 
        var mass = Math.pow(radius, 2) / 100;
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
        var radius = 9; 
        var mass = Math.pow(radius, 2) / 100;
        var x = Math.random() * (canvas.width - 2 * radius) + radius;
        var y = Math.random() * (canvas.height - 2 * radius) + radius;
        var dx = (Math.random() * 1 - 0.5);
        var dy = (Math.random() * 1 - 0.5);
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
        circles[i].updatePosition();
    }

    countConcentration();

    requestAnimationFrame(updateCircles);
}

function countConcentration() {
    let soluteLcount = 0;
    let solventLcount = 0;
    let soluteRcount = 0;
    let solventRcount = 0;

    for(var i = 0; i < circles1.length; i++) {
        if(circles1[i].xpos < halfWidth) {
            solventLcount++;
        }
        else if(circles[i].xpos > halfWidth) {
            solventRcount++;
        }
    }

    for(var i = 0; i < circles2.length; i++) {
        if(circles2[i].xpos < halfWidth) {
            soluteLcount++;
        }
        if(circles2[i].xpos > halfWidth) {
            soluteRcount++;
        }
    }

    let concentrationL = soluteLcount / solventLcount;
    let concentrationR = soluteRcount / solventRcount;

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
    updateCircles();
    setInterval(() => countConcentration(), 1000);
}
