function Rocket(lifespan, target, genes) {
  this.pos = createVector(width/2,height-10);
  this.vel = createVector();
  this.acc = createVector();
  if (genes) {
    this.dna = new DNA(lifespan, genes);
  } else {
    this.dna = new DNA(lifespan);
  }
  this.maxSpeed = 5;
  this.target = target;
  this.curFitness = 0;
  this.prob = 0;
}

Rocket.prototype.update = function (count, halt) {
  if (!halt) {
      this.applyForce(this.dna.genes[count]);
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.updateFitness();
  }
  // console.log(this.pos);
}

Rocket.prototype.updateFitness = function () {
  this.curFitness = 1/dist(this.pos.x, this.pos.y, this.target.x, this.target.y) * 100;
}

Rocket.prototype.draw = function () {
  push();
  noStroke();
  translate(this.pos.x, this.pos.y);

  push();
  rotate(this.vel.heading());
  // rect(0, 0, 39, 5);
  // triangle(
  //   5, 0,  // right
  //   -5, 0, // left
  //   0, -20  // top
  // )
  triangle(
    20, 0, // right
    0, -5, // left
    0, +5  // top
  );
  pop();


  fill(0, 255, 0);
  text(nfc(this.curFitness,3), 0,0);

  pop();
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


  return new Rocket(this.lifespan, this.target, newGenes);
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
    limit = 0.1;
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
