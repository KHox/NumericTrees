let world = new World();
let gen = [
  [30, 1, 30, 30],
  [2, 0, 3, 30],
  [2, 30, 30, 30],
  [30, 30, 3, 30]
]
let tree = new Tree({gen, x: 70, y: 143});
world.add(tree);
