const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const halfWidth = canvas.width / 2;
const startButton = document.getElementById("startButton");
const numCircle1Slider = document.getElementById("numCircle1Slider");
const numCircle2Slider = document.getElementById("numCircle2Slider");

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

    updateVelocity(m1, m2, v1, v2) {
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

    updatePosition() {
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

        for(var j = 0; j < circles.length; j++) {
            if(!(this.index == j)) {
                if(Math.sqrt(Math.pow(this.xpos - circles[j].xpos + this.xvel - circles[j].xvel, 2) + Math.pow(this.ypos - circles[j].ypos + this.yvel - circles[j].yvel, 2)) < (this.radius + circles[j].radius)) {
                    var tempX = this.xvel;
                    var tempY = this.yvel;

                    this.xvel = this.updateVelocity(this.mass, circles[j].mass, this.xvel, circles[j].xvel);
                    this.yvel = this.updateVelocity(this.mass, circles[j].mass, this.yvel, circles[j].yvel);
                    circles[j].xvel = ((this.mass * tempX + circles[j].mass * circles[j].xvel) - (this.mass * this.xvel)) / circles[j].mass;
                    circles[j].yvel = ((this.mass * tempY + circles[j].mass * circles[j].yvel) - (this.mass * this.yvel)) / circles[j].mass;
                }
                else {

                }
            }
        }

        this.xpos += this.xvel;
        this.ypos += this.yvel;

        this.draw(ctx);
    }
}

/**function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}*/

function createCircles() {
    circles = [];
    circles1 = [];
    circles2 = [];

    const numCircle1 = numCircle1Slider.value;
    const numCircle2 = numCircle2Slider.value;
    var a = 0;
    var b = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        if(x < halfWidth) {
            if(x + radius > halfWidth) {
                overlapping = true;
            }
        }
        else if(x > halfWidth) {
            if(x - radius < halfWidth) {
                overlapping = true;
            }
        }

        if(!overlapping) {
            circles1[a] = new Circle(x, y, mass, radius, color, dx, dy, "circle1", a);
            circles1[a].draw(ctx);
            a++;
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

        if(x + radius == halfWidth) {
            overlapping = true;
        }

        if(x < halfWidth) {//could just make this a function since its used twice, do it later
            if(x + radius > halfWidth) {
                overlapping = true;
            }
        }
        else if(x > halfWidth) {
            if(x - radius < halfWidth) {
                overlapping = true;
            }
        }

        if(!overlapping) {
            var indexCon = b + a;
            circles2[b] = new Circle(x, y, mass, radius, color, dx, dy, "circle2", indexCon);
            circles2[b].draw(ctx);
            b++;
        }
    }

    circles.push(...circles1, ...circles2);
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

    ctx.fillText(circles.length, 100, 100);

    for(var i = 0; i < circles.length; i++) {
        circles[i].updatePosition();
    }

    requestAnimationFrame(updateCircles);
}

numCircle1Slider.onchange = function() {
    createCircles();
}

numCircle2Slider.onchange = function() {
    createCircles();
}

startButton.onclick = function() {
    ctx.fillText(circles, 100, 100);
    updateCircles();
}
