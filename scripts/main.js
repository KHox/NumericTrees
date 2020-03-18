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
//let tree = new Tree({gen, x: 70, y: 143, color: 'lime'});
let spruce = new Spruce({x: 127, y: 143});
world.add(spruce);
world.start(40);
