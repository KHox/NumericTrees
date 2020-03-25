class Tree {
  constructor({gen, x, y, color}) {
    this.gen = gen;
    this.color = color;
    this.treeBlocks = [];
    this.newSeeds = [];
    this.energy = world.startEnergy;
    this.age = 0;
    this.died = true;
    if (!isNaN(y) && !isNaN(x)) {
      if (y == 143) this.died = false;
      this.seeds = [{x, y, num: 0, step: 0}];
      world.setSeed(x, y, 0);
    }
  }

  grow() {
    for (let j = 0; j < this.seeds.length; j++) {
      let seed = this.seeds[j];
      let {x, y} = seed;
      seed.step += world.getLevel(x, y);
      if (seed.step > 1) {
        this.treeBlocks.push({x, y});
        world.setTree(x, y, this.color);
        let gens = this.gen[seed.num];
        let coords = [
          {x: x - 1, y}, //left
          {x, y: y - 1}, //up
          {x: x + 1, y}, //right
          {x, y: y + 1} //down
        ];
        if (coords[0].x == -1) coords[0].x = 255;
        if (coords[2].x == 256) coords[2].x = 0;
        for (let i = 0; i < 4; i++) {
          if ((gens[i] < 16) && world.isEmpty(coords[i].x, coords[i].y)) {
            world.setSeed(coords[i].x, coords[i].y, gens[i]);
            this.newSeeds.push({x: coords[i].x, y: coords[i].y, num: gens[i], step: 0});
          }
        }
      } else {
        this.newSeeds.push(seed);
      }
    }
    this.seeds = this.newSeeds;
    this.newSeeds = [];
  }

  getEnergy() {
    this.treeBlocks.forEach(tree => {
      let {x, y} = tree;
      this.energy += (world.getLevel(x, y) + 1) * (149 - y + world.season);
    });
  }

  spendEnergy() {
    this.energy -= 13 * (this.seeds.length + this.treeBlocks.length);
  }

  step() {
    if (this.died) return this.trackSeeds();
    if ((this.energy < 1) || this.seeds.length == 0 || (this.age > (random(16) + world.treeAge))) {
      this.die();
    } else {
      this.getEnergy();
      this.spendEnergy();
      this.grow();
      this.age++;
    }
  }

  die() {
    this.treeBlocks.forEach(tree => {
      world.removeBlock(tree.x, tree.y);
    });
    this.treeBlocks = [];
    this.died = true;
  }

  trackSeeds() {
    if (this.seeds.length == 0) return true;
    for (let i = 0; i < this.seeds.length; i++) {
      let seed = this.seeds[i];
      let {x, y} = seed;
      world.removeBlock(x, y);
      if (y == 143) { //Fell
        this.seeds.del(seed);
        i--;
        if (world.isGrowable(x, y) && ~world.getLevel(x, y)) this.newTree(x, y);
      } else if (world.isEmpty(x, y + 1)) { //Falling
        world.setSeed(x, y + 1, seed.num);
        seed.y++;
      } else {
        this.seeds.del(seed);
        i--;
      }
    }
  }

  newTree(x, y) {
    let gen;
    let color;
    if (random(100) < 25) {
      gen = world.getMutate(this.gen);
      color = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    } else {
      gen = this.gen;
      color = this.color;
    }
    let tree = new Tree({x, y, gen, color});
    world.add(tree);
  }

  delete() {
    this.die();
    this.seeds.forEach(seed => {
      world.removeBlock(seed.x, seed.y);
    });
    this.seeds = [];
  }
}

class Spruce extends Tree {
  constructor({x, y}) {
    let gen = Spruce.gen;
    super({gen, x, y, color: 'rgb(7, 84, 48)'});
  }
}
Spruce.gen = [
  [1, 16, 16, 16],
  [16, 2, 16, 16],
  [3, 16, 16, 16],
  [16, 4, 16, 16],
  [16, 5, 16, 16],
  [8, 6, 7, 16],
  [12, 16, 16, 16],
  [16, 16, 9, 16],
  [10, 16, 16, 16],
  [16, 16, 7, 16],
  [8, 16, 16, 16],
  [16, 16, 16, 16],
  [16, 5, 16, 16],
  [16, 16, 16, 16],
  [16, 16, 16, 16],
  [16, 16, 16, 16]
];

class RandomTree extends Tree {
  constructor({x, y, color}) {
    let gen = [];
    for (let i = 0; i < 16; i++) {
      gen.push([random(30), random(30), random(30), random(30)]);
    }
    if (!color) color = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    super({gen, x, y, color});
  }
}

Array.prototype.del = function(elem) {
  let f = false;
  for (let i = 0; i < this.length - 1; i++) {
    if (this[i] == elem) f = true;
    if (f) {
      this[i] = this[i + 1];
    }
  }
  if (f || this[this.length - 1] == elem) {
    this.length--;
  }
  return this;
}

function random(n) {
  return Math.floor(Math.random() * (n + 1));
}
