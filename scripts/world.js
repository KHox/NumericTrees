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

  setTree(x, y) {
    let cell = world.getCell(x, y);
    cell.classList.remove('seed');
    cell.classList.add('tree');
    cell.innerHTML = '';
  }

  getCell(x, y) {
    return this.table.rows[y].cells[x];
  }

  removeBlock(x, y) {
    let cell = world.getCell(x, y);
    cell.classList.remove('tree');
    cell.classList.remove('seed');
    cell.innerHTML = '';
  }

  getLevel(x, y) {
    let count = 0;
    for (let i = 0; i < y; i++) {
      let cl = this.getCell(x, i).classList;
      if (cl.contains('tree') || cl.contains('seed')) count++;
    }
    if (count == 2) return 0;
    if (count == 1) return 1;
    if (count == 0) return 2;
    return -1;
  }

  isEmpty(x, y) {
    if ((x > 255) || (y > 143) || (x < 0) || (y < 0)) return;
    let cl = this.getCell(x, y).classList;
    return !(cl.contains('tree') || cl.contains('seed'));
  }

  step() {
    this.trees = this.trees.concat(this.newTrees);
    this.newTrees = [];
    for (let i = 0; i < this.trees.length; i++) {
      if (this.trees[i].step()) {
        this.trees.del(this.trees[i]);
        i--;
      }
    }
  }

  add(tree) {
    this.newTrees.push(tree);
  }
}
