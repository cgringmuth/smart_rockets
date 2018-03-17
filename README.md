# Smart rockets
The idea is to model an evolutionary process which, given a population of rockets, finds the best way to a target. Each rocket incorporate a sequence of forces which will be applied each step. The force sequence is the DNA (which it self contains genes) of each rocket. At the beginning a collection of rockets are spawned. The DNA is generated completely random. Each population has a number of iteration (lifespan) after all rockets "die" and based on an evolution process new "child" rockets will be generated.

The generation is very similar to an evolutionary process:
- Select 2 parents
- Create child from the parents
- Mutate genes based on specified mutation rate

## Selecting 2 parents
From the current population 2 parents will be selected to create a new rocket. For the selection process we need some kind of fitness. The fitness is determined based on how far each rocket is after the end of each iteration and how long did it take for a rocket to hit the target, if it actually hit it. This fitness is recomputed to a probability. The probability defines how likely it is that a rocket is chosen to be a parent. Thus the rocket with the highest fitness is more likely to be chosen as a parent.

## Create child
2 parent rockets will be "crossed" to create a new child rocket. There are many different techniques to do this. My current approach is the following. Create a new DNA with the same length of the parents. Iterate through the new DNAs gene and randomly select from which parent we pick a "gene" segment. Another approach would be: just pick one half of the DNA from one parent the other from the other parent.

## Mutate
Mutation is also very important in an evolution process like this. If there would no mutation and your starting population is too small, you will never reach an optimal path. With small population I mean less 100k or so. So, a population of 100 (like this example) is much too small. However, you might be lucky and  by chance you spawned a rocket which is already optimal or in your population exists a combination of parents which results an optimal path. Anyhow, this is not very likely.

Thus mutation is introduced. This somehow helps to get out of a local optimum. Mutation is currently implemented as follows. Iterate through a child gene and get a random number between 0 and 1. If this number is equal or less than the mutation rate, replace this part of the gene with a random gene part (force).

# Example
The following example Shows a population of 100 rockets. The lifespan is 500 and the mutation rate is 0.01%. In the following image you can see that in the beginning all rockets flew very random while over time they are focusing more and more towards the target.

![smart rockets example](smart_rockets.gif)

# TODO
- Add obstacles. Rockets have to fly around to the target.
