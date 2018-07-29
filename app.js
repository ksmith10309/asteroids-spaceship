var canvas = document.getElementById("canvas");
var processing = new Processing(canvas, function(processing) {
      
    with (processing) {
          size(window.innerWidth, window.innerHeight);
      
      
//Processing.js code        
var Spaceship = function() {
    this.position = new PVector(width/2, height/2);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0.1, 0);
    this.topspeed = 5;
    this.angle = 0;
    this.shield = true;
};

Spaceship.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
};

Spaceship.prototype.turnLeft = function() {
    this.angle -= PI/8;
};

Spaceship.prototype.turnRight = function() {
    this.angle += PI/8;
};

Spaceship.prototype.thrust = function() {
    var force = new PVector(0.1, 0);
    force.rotate(this.angle);
    this.acceleration.add(force);
};

Spaceship.prototype.slow = function() {
    var force = new PVector(-0.1, 0);
    force.rotate(this.angle);
    this.acceleration.add(force);
};

Spaceship.prototype.display = function () {
    var angle = this.angle;
    var rocket = 100*sin(frameCount);
    stroke(0, 0, 0);
    strokeWeight(2);
    
    pushMatrix();
    rectMode(CENTER);
    translate(this.position.x, this.position.y);
    rotate(angle);
    
    fill(250, 150 + rocket, 0);
    ellipse(-33, 0, 30, 18);
    
    fill(100, 100, 100);
    rect(-10, 0, 20, 35);
    quad(0, -10, 35, -7, 35, 7, 0, 10);
    
    fill(100, 50, 50);
    triangle(20, 0, 30, 5, 30, -5);
    rect(-25, 0, 10, 20);
    ellipse(-10, 24, 25, 15);
    ellipse(-10, -24, 25, 15);
    popMatrix();
};

Spaceship.prototype.checkEdges = function () {
    if (this.position.x > width) {
        this.position.x = 0;
    } else if (this.position.x < 0) {
        this.position.x = width;
    }
    
    if (this.position.y > height) {
        this.position.y = 0;
    } else if (this.position.y < 0) {
        this.position.y = height;
    }
};

var Photon = function(x, y, theta) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0.3, 0);
    this.acceleration.rotate(theta);
    this.angle = theta;
};

Photon.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
};

Photon.prototype.display = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    fill(227, 227, 22);
    ellipse(0, 24, 16, 8);
    ellipse(0, -24, 16, 8);
    popMatrix();
};
      
var Star = function(x, y, m) {
    this.x = x;
    this.y = y;
    this.mass = m;
};

Star.prototype.display = function() {
    var twinkle = 50*sin(frameCount);
    pushMatrix();
    translate(this.x, this.y);
    noStroke();
    fill(250, 250, 250, 200 + twinkle);
    ellipse(0, 0, this.mass, this.mass);
    popMatrix();
};

var blueshade = color(50, 50, 100);
var greenshade = color(50, 100, 50);
      
var Enemy = function(x, y, angle, color) {
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
  
    var force = new PVector(0.05, 0);
    force.rotate(angle)
    this.acceleration.add(force);
    this.angle = angle;
    this.color = color;
};
      
Enemy.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
};
      
Enemy.prototype.display = function() {
    var angle = this.angle;
    var rocket = 100*sin(frameCount);
    stroke(0, 0, 0);
    strokeWeight(2);
    
    pushMatrix();
    rectMode(CENTER);
    translate(this.position.x, this.position.y);
    rotate(angle);
    
    fill(250, 150 + rocket, 0);
    ellipse(-33, 0, 30, 18);
    
    fill(100, 100, 100);
    rect(-10, 0, 20, 35);
    quad(0, -10, 35, -7, 35, 7, 0, 10);
    
    fill(this.color);
    triangle(20, 0, 30, 5, 30, -5);
    rect(-25, 0, 10, 20);
    ellipse(-10, 24, 25, 15);
    ellipse(-10, -24, 25, 15);
    popMatrix();
};
      
var Blast = function(x, y) {
    this.position = new PVector(x, y);
    this.bright = 250;
    this.radius = 10;
};    
      
Blast.prototype.display = function() {
    pushMatrix();
    translate(this.position.x, this.position.y);
  
    fill(250, this.bright-50, 0, this.bright-50);
    ellipse(0, 0, this.radius+50, this.radius+50);
  
    fill(250, this.bright, 0, this.bright);
    ellipse(0, 0, this.radius, this.radius);
     
    popMatrix();
    this.bright-=8;
    this.radius+=2;
};

var ship = new Spaceship();
var photons = [];
var enemies = []; 
var blasts = [];
      
var stars = [];
for (var i = 0; i < 100; i++) {
    stars.push(new Star(random(0,width), random(0,height), random(1,6)));
}

draw = function() {
    background(0, 0, 0);
    
    for (var s = 0; s < stars.length; s++)
        {
        stars[s].display();
        }
  
    keyPressed = function() {
        if (keyCode === LEFT) {
        ship.turnLeft();
        } else if (keyCode === RIGHT) {
        ship.turnRight();
        } else if (keyCode === UP) {
        ship.thrust();    
        } else if (keyCode === DOWN) {
        ship.slow();
        } else if (keyCode === 32) {
        photons.push(new Photon(ship.position.x, ship.position.y, ship.angle));
        }
    };
    
    for (var p = photons.length-1; p >= 0; p--) {
        photons[p].update();
        photons[p].display();
        if (photons[p].position.x < 0 || photons[p].position.x > width || photons[p].position.y < 0 || photons[p].position.y > height)
            {
            photons.splice(p, 1);
            }
    }
  
    if (frameCount%50 === 0)
        {
        enemies.push(new Enemy(random(width/4, (3/4)*width), -50, random(PI/4, (3/4)*PI), blueshade))
        }
    else if (frameCount%25 === 0) 
        {
        enemies.push(new Enemy(random(width/4, (3/4)*width), height+50, random((5/4)*PI, (7/4)*PI), greenshade))  
        }
  
    for (var a = enemies.length-1; a >= 0; a--) {  
        enemies[a].update();
        enemies[a].display();
      
        if (enemies[a].position.x < -50 || enemies[a].position.x > width+50 || enemies[a].position.y < -50 || enemies[a].position.y > height+50)  
            {
            enemies.splice(a, 1);
            }
    
      
        if (ship.position.x > enemies[a].position.x-50 && ship.position.x < enemies[a].position.x+50 && ship.position.y > enemies[a].position.y-50 && ship.position.y < enemies[a].position.y+50) 
            {
            blasts.push(new Blast(enemies[a].position.x, enemies[a].position.y));  
            enemies.splice(a, 1);  
            }

        for (var p = photons.length-1; p >= 0; p--) {
            if (photons[p].position.x > enemies[a].position.x-50 && photons[p].position.x < enemies[a].position.x+50 && photons[p].position.y > enemies[a].position.y-50  && photons[p].position.y < enemies[a].position.y+50) 
                {
                blasts.push(new Blast(enemies[a].position.x, enemies[a].position.y));
                enemies.splice(a, 1);
                photons.splice(p, 1);
                }
        }           
    }
  
    for (var b = 0; b < enemies.length; b++) {
        for (var c = b + 1; c < enemies.length; c++) {
            if (enemies[b] != enemies[c]) {
                if (enemies[b].position.x > enemies[c].position.x-50 && enemies[b].position.x < enemies[c].position.x+50 && enemies[b].position.y > enemies[c].position.y-50  && enemies[b].position.y < enemies[c].position.y+50) 
                    { 
                    blasts.push(new Blast(enemies[c].position.x, enemies[c].position.y));  
                    blasts.push(new Blast(enemies[b].position.x, enemies[b].position.y));
                    enemies.splice(c, 1);
                    enemies.splice(b, 1);        
                    }
            }  
        }
    }
  
    for (var i = blasts.length-1; i >= 0; i--) 
        {
        blasts[i].display();
          if (blasts[i].radius > 50)
            {
            blasts.splice(i, 1);  
            }
        }
  
    ship.update();
    ship.checkEdges();
    ship.display();
};

          
    }    
});