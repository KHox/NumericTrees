let world = new World();
let gen = [
  [30, 1, 30, 30],
  [2, 0, 3, 30],
  [2, 30, 30, 30],
  [30, 30, 3, 30],
];
for (let i = 4; i < 16; i++) {
  gen.push([16, 16, 16, 16]);
}
let tree = new Tree({gen, x: 70, y: 143, color: 'lime'});
world.add(tree);
world.start(0);
