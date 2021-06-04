const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

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
        if(this.xpos + this.radius + this.xvel > canvas.width || this.xpos - this.radius + this.xvel< 0) {
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

                    this.color = "blue";
                    this.xvel = this.updateVelocity(this.mass, circles[j].mass, this.xvel, circles[j].xvel);
                    this.yvel = this.updateVelocity(this.mass, circles[j].mass, this.yvel, circles[j].yvel);
                    circles[j].xvel = ((this.mass * tempX + circles[j].mass * circles[j].xvel) - (this.mass * this.xvel)) / circles[j].mass;
                    circles[j].yvel = ((this.mass * tempY + circles[j].mass * circles[j].yvel) - (this.mass * this.yvel)) / circles[j].mass;
                }
                else {
                    this.color = "black";
                }
            }
        }

        //let xPosition = this.xpos + this.xvel + this.radius;
        //let yPosition = this.ypos + this.yvel + this.radius;

        /**if(this.xpos + this.xvel + this.radius > canvas.width) {
            this.xpos += canvas.width - this.xpos - this.radius;
        }
        if(this.ypos + this.yvel + this.radius > canvas.height) {
            this.ypos += canvas.height - this.ypos - this.radius;
        }
        if(!(this.xpos + this.xvel + this.radius > canvas.width || this.ypos + this.yvel + this.radius > canvas.height)) {
            this.xpos += this.xvel;
            this.ypos += this.yvel;
        }**/

        this.xpos += this.xvel;
        this.ypos += this.yvel;

        this.draw(ctx);
    }
}


function createCircles() {
    var circle1 = new Circle(100, 100, 0.5, 5, "black", 0, 0, 0);
    circles.push(circle1);
    circles[0].draw(ctx);

    var circle2 = new Circle(150, 150, 1, 20, "red", 4, 2, 1);
    circles.push(circle2);
    circles[1].draw(ctx);

    var circle3 = new Circle(75, 125, 0.75, 10, "green", 1, 1, 2);
    circles.push(circle3);
    circles[2].draw(ctx);

    startButton.onclick = function updateCircles() {
        requestAnimationFrame(updateCircles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(var i = 0; i < circles.length; i++) {
            circles[i].updatePosition();
        }

        ctx.fillText(circle1.xvel.toFixed(2), 20, 20);
        ctx.fillText(circle1.yvel.toFixed(2), 20, 30);
        ctx.fillText(circle2.xvel.toFixed(2), 50, 20);
        ctx.fillText(circle2.yvel.toFixed(2), 50, 30);
    }
}

createCircles();
