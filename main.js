const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

let circles = [];

class Circle {
    constructor(xpos, ypos, radius, color) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.v_x = 1;
        this.y_x = 1;
    }

    getxpos() {
        return (
            this.xpos
        );
    }

    getypos() {
        return (
            this.ypos
        );
    }
    
    getradius() {
        return (
            this.radius
        );
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.arc(this.xpos, this.ypos, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        if(this.xpos + this.radius > canvas.width) { //hits the right wall
            this.v_x = -1;
        }
        else if(this.xpos - this.radius < 0) { //hits the left wall
            this.v_x = 1;
        }
        else if(this.ypos + this.radius > canvas.height) { //hits the bottom wall
            this.y_x = -1;
        }
        else if(this.ypos - this.radius < 0) { //hits the top wall
            this.y_x = 1;
        }

        for(var i = 0; i < circles.length; i++) {
            for(var j = 0; j < circles.length; j++) {
                if(i != j) {
                    if(Math.sqrt(Math.pow(circles[i].xpos - circles[j].xpos, 2) + Math.pow(circles[i].ypos - circles[j].ypos, 2)) 
                    < (circles[i].radius + circles[j].radius)) {
                        circles[j].color = "blue";
                    }
                    else {
                        circles[j].color = "black";
                    }
                }
            }
        }

        this.xpos += this.v_x;
        this.ypos += this.y_x;

        this.draw(ctx);
    }
}


function createCircles() {
    var circle1 = new Circle(100, 100, 5, "black");
    circles.push(circle1);
    circles[0].draw(ctx);

    var circle2 = new Circle(200, 200, 20, "red", "2");
    circles.push(circle2);
    circles[1].draw(ctx);

    startButton.onclick = function updateCircles() {
        requestAnimationFrame(updateCircles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(var i = 0; i < circles.length; i++) {
            circles[i].update();
        }
    }
}

createCircles();
