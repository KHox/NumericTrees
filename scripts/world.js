class World {
  constructor() {
    this.table = document.querySelector('#screen');
    this.season = 0;
    this.trees = [];
    this.newTrees = [];
  }

  setSeed(x, y, num) {
    this.getCell(x, y).classList.add('seed');
    this.getCell(x, y).innerHTML = num;
  }

  setTree(x, y, color) {
    let cell = world.getCell(x, y);
    cell.classList.remove('seed');
    cell.classList.add('tree');
    cell.innerHTML = '';
    cell.style.backgroundColor = color;
  }

  getCell(x, y) {
    return this.table.rows[y].cells[x];
  }

  removeBlock(x, y) {
    let cell = world.getCell(x, y);
    cell.classList.remove('tree');
    cell.classList.remove('seed');
    cell.innerHTML = '';
    cell.style.backgroundColor = '';
  }

  getLevel(x, y) {
    let count = 0;
    for (let i = y - 1; i > -1; i--) {
      let cl = this.getCell(x, i).classList;
      if (cl.contains('tree') || cl.contains('seed')) count++;
      if (count == 3) return -1;
    }
    if (count == 2) return 0;
    if (count == 1) return 1;
    if (count == 0) return 2;
  }

  isEmpty(x, y) {
    if ((x > 255) || (y > 143) || (x < 0) || (y < 0)) return;
    let cl = this.getCell(x, y).classList;
    return !(cl.contains('tree') || cl.contains('seed'));
  }

  isGrowable(x, y) {
    for (let i = x - 3; i < x + 4; i++) {
      if (!world.isEmpty(i, y)) return false;
    }
    return true;
  }

  step() {
    this.trees = this.newTrees;
    this.newTrees = [];
    for (let i = 0; i < this.trees.length; i++) {
      if (!this.trees[i].step()) this.newTrees.push(this.trees[i]);
    }
    return this;
  }

  add(tree) {
    this.newTrees.push(tree);
    return this;
  }

  getMutate(gen) {
    let newGen = [];
    for (var i = 0; i < gen.length; i++) {
      newGen.push([]);
      for (var j = 0; j < 4; j++) {
        newGen[i].push(gen[i][j]);
      }
    }
    newGen[random(gen.length - 1)][random(3)] = random(gen.length);
    return newGen;
  }

  start(ms, n = 1) {
    this.stop();
    this.timerId = setInterval(() => {
      for (let i = 0; i < n; i++) world.step();
    }, ms);
    return this;
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
    return this;
  }

  clearAll() {
    this.trees.concat(this.newTrees).forEach(tree => {
      tree.delete()
    });
    this.trees = this.newTrees = [];
    return this;
  }
}
