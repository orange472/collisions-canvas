const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

class Circle {
    constructor(xpos, ypos, radius, color) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.v_x = 1;
        this.y_x = 1;
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
        if(this.xpos + this.radius > canvas.width) {
            this.v_x = -1;
        }
        else if(this.xpos - this.radius < 0) {
            this.v_x = 1;
        }
        else if(this.ypos + this.radius > canvas.height) {
            this.y_x = -1;
        }
        else if(this.ypos - this.radius < 0) {
            this.y_x = 1;
        }

        this.xpos += this.v_x;
        this.ypos += this.y_x;

        this.draw(ctx);
    }
}


function createCircles() {
    var circle1 = new Circle(100, 100, 5, "black");
    circle1.draw(ctx);

    var circle2 = new Circle(200, 200, 20, "red", "2");
    circle2.draw(ctx);

    function updateCircles() {
        requestAnimationFrame(updateCircles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circle1.update();
        circle2.update();
    }

    updateCircles();
}

createCircles();

