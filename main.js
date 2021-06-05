const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const numCirclesSlider = document.getElementById("numCirclesSlider");

let circles = [];

class Circle {
    constructor(xpos, ypos, mass, radius, color, xvel, yvel, index) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.xvel = xvel;
        this.yvel = yvel;
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

function createCircles() {
    circles = [];

    const numCircles = numCirclesSlider.value;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var n = 0; n < numCircles; n++) {
        var radius = Math.floor(Math.random() * 26) + 5; 
        var mass = Math.pow(radius, 2) / 100;
        var x = Math.random() * (canvas.width - radius) + radius;
        var y = Math.random() * (canvas.height - radius) + radius;
        var color = "black";
        var dx = (Math.random() * 4 + 0.5);
        var dy = (Math.random() * 4 + 0.5);

        circles[n] = (new Circle(x, y, mass, radius, color, dx, dy, n));
        circles[n].draw(ctx);

    }
}

function updateCircles() {
    ctx.fillText(circles.length, 100, 100);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < circles.length; i++) {
        circles[i].updatePosition();
    }

    requestAnimationFrame(updateCircles);
}

numCirclesSlider.onchange = function() {
    createCircles();
}

startButton.onclick = function() {
    updateCircles();
}
