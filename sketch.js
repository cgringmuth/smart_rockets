function preload() {

}

var population;
var lifespan = 400;
var count = 0;
var popCount = 150;
var target;
var halt;
var mutateRate = 0.01;

function setup() {
  createCanvas(800, 600);
  background(51);
  // rectMode(CENTER);
  target = createVector(width/2, 50);
  population = new Population();
  halt = false;
}

function draw() {
  background(51, 75);
  population.run();
  noStroke();
  ellipse(target.x, target.y, 15);
  if (!halt) {
      count++;
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    halt = !halt;
  }
}


function Population() {
  this.rockets = [];
  for (var i=0; i<popCount; ++i) {
    this.rockets.push(new Rocket(lifespan, target));
  }
}

Population.prototype.run = function () {
  if (count >= lifespan) {
    count = 0;
    this.create();
  }

  this.rockets.forEach(function (rocket) {
    rocket.update(count, halt);
    rocket.draw();
  });
}

Population.prototype.create = function () {
  newRockets = [];
  // estimate propbability
  var sumFitness = 0;
  this.rockets.forEach(function (rocket) {
    sumFitness += rocket.curFitness;
  });

  this.rockets.forEach(function (rocket) {
    rocket.prob = rocket.curFitness / sumFitness;
  });

  // create new popuplation
  for (var i=0; i<popCount; ++i) {
    // select parents
    var parentA = this.selectParent();
    var parentB = this.selectParent();
    // crossover genes
    var newRocket = parentA.crossover(parentB)
    // mutate
    newRocket.mutate(mutateRate);

    newRockets.push(newRocket);
  }
  this.rockets = newRockets;
}

Population.prototype.selectParent = function () {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r -= this.rockets[index].prob;
    index++;
  }
  index--;
  return this.rockets[index];
}
