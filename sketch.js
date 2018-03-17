function preload() {

}
p5.disableFriendlyErrors = true;
var population;
var lifespan = 500;
var count = 0;
var popCount = 100;
var target;
var start;
var halt;
var mutateRate = 0.0001;
var lifespanP;
var bestFitnessP;
var bestFitness;
var meanFitnessP;
var iteration = 1;
var iterationP;

function setup() {
  createCanvas(800, 600);
  background(51);
  // rectMode(CENTER);
  target = createVector(width/2, 50);
  start = createVector(width/2,height-30);
  population = new Population();
  halt = false;
  lifespanP = createP();
  iterationP = createP();
  bestFitnessP = createP();
  meanFitnessP = createP();
  meanFitnessP.html("mean fitness: ");
}

function draw() {
  background(51);
  noStroke();
  fill(255);
  ellipse(target.x, target.y, 15);
  population.run();
  if (!halt) {
      count++;
  }
  lifespanP.html("life span: "+str(lifespan-count));
  bestFitnessP.html("best fitness: "+str(bestFitness));
  iterationP.html("iteration: "+str(iteration));
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    halt = !halt;
  }
}


function Population() {
  this.rockets = [];
  for (var i=0; i<popCount; ++i) {
    this.rockets.push(new Rocket(lifespan, start, target));
  }
}

Population.prototype.alive = function () {
  var alive = false;
  this.rockets.forEach(function (rocket) {
    if (rocket.alive()) {
      alive = true;
      return;
    }
  });
  return alive;
}

Population.prototype.meanFitness = function () {
  var mean = 0;
  this.rockets.forEach(function (rocket) {
    mean += rocket.fitness;
  });
  mean /= popCount;
  return mean;
};

Population.prototype.run = function () {
  if (count >= lifespan || !this.alive()) {
    iteration++;
    count = 0;
    meanFitnessP.html("mean fitness: " + str(this.meanFitness()));
    this.create();
  }

  bestFitness = 0;
  this.rockets.forEach(function (rocket) {
    var fitness = rocket.update(count, halt);
    if (bestFitness < fitness) {
      bestFitness = fitness;
    }
  });

  var c;
  this.rockets.forEach(function (rocket) {
    if (rocket.fitness === bestFitness) {
      c = color(255, 0, 0);
    } else {
      c = color(255);
    }
    rocket.draw(c);
  });
}

Population.prototype.create = function () {
  newRockets = [];
  // estimate propbability
  var sumFitness = 0;
  this.rockets.forEach(function (rocket) {
    sumFitness += rocket.fitness ;
  });

  this.rockets.forEach(function (rocket) {
    rocket.prob = rocket.fitness / sumFitness;
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
