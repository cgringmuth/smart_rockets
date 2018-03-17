function Rocket(lifespan, start, target, genes) {
  this.start = start;
  this.pos = start.copy();
  this.poslist = [];
  this.vel = createVector();
  this.acc = createVector();
  if (genes) {
    this.dna = new DNA(lifespan, genes);
  } else {
    this.dna = new DNA(lifespan);
  }
  this.maxSpeed = 5;
  this.target = target;
  this.fitness = 0;
  this.prob = 0;
  this.targetReachedCount = -1;
  this.crashed = false;
}

Rocket.prototype.alive = function () {
  return !this.crashed && this.targetReachedCount < 0;
}

Rocket.prototype.update = function (count, halt) {
  if (!halt && this.alive()) {
      this.applyForce(this.dna.genes[count]);
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.poslist.push(this.pos.copy());
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.updateFitness(count);
      this.checkCollision();
  }
  return this.fitness;
}

Rocket.prototype.checkCollision = function () {
  // check walls
  this.crashed = this.crashed || this.pos.x < 0 || this.pos.x > width;
  this.crashed = this.crashed || this.pos.y < 0 || this.pos.y > height;
}

Rocket.prototype.updateFitness = function (count) {
  var d = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
  this.fitness = 1/d * 100;

  if (d < 5) {
      this.targetReachedCount = count;
      this.fitness += (1/this.targetReachedCount) * 100;  // bump up fitness based time to reach
  }
}

Rocket.prototype.draw = function (c) {
  if (!c) {
    c = color(255);
  }
  push();
  noStroke();
  translate(this.pos.x, this.pos.y);
  fill(c);
  push();
  rotate(this.vel.heading()+PI/2);
  // rect(0, 0, 39, 5);
  // triangle(
  //   5, 0,  // right
  //   -5, 0, // left
  //   0, -20  // top
  // )
  triangle(
    0, -20, // top
    -5, 0, // left
    +5, 0  // right
  );
  pop();
  ellipse(0, 0, 10);

  // fill(0, 255, 0);
  // text(nfc(this.fitness,3), 0,0);

  pop();
  for (var i = 1; i < this.poslist.length; i++) {
    if (this.crashed) {
      stroke(100);
    } else {
      stroke(c);
    }

    var p1 = this.poslist[i-1];
    var p2 = this.poslist[i];
    line(p1.x, p1.y, p2.x, p2.y);
  }
}

Rocket.prototype.applyForce = function (f) {
  this.acc.add(f);
}

Rocket.prototype.crossover = function (other) {
  var genes = this.dna.genes;
  var otherGenes = other.dna.genes;
  var newGenes = [];

  // var mid = round(genes.length/2);
  // for (var i=0; i<mid; i++) {
  //   newGenes.push(genes[i]);
  // }
  // for (var i=mid; i<genes.length; i++) {
  //   newGenes.push(otherGenes[i]);
  // }

  for (var i=0; i<genes.length; i++) {
    if (random(1) <= 0.5) {
      newGenes.push(otherGenes[i]);
    } else {
      newGenes.push(genes[i]);
    }

  }


  return new Rocket(this.lifespan, this.start, this.target, newGenes);
}

Rocket.prototype.mutate = function (mutateRate) {
  for (var i = 0; i < this.dna.genes.length; i++) {
    var r = random(1);
    if (r <= mutateRate) {
      this.dna.genes[i] = randomForce();
    }
  }
}

function randomForce(limit) {
  if (!limit) {
    limit = 0.3;
  }
  force = p5.Vector.random2D();
  force.limit(limit);
  return force;
}


function DNA(lifespan, genes) {
  this.genes = [];

  if (genes) {
      this.genes = genes
  } else {
    for (var i = 0; i < lifespan; ++i) {
      this.genes.push(randomForce());
    }
  }
}
