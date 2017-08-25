// Optional configuration
// {antialias: boolean, transparent: boolean, resolution: number}
const renderer = PIXI.autoDetectRenderer(256, 256);
// renderer.autoResize = true;
// renderer.resize(512, 512);

// Add the canvas to the HTML document
document.body.appendChild(renderer.view);

// Create a container object called the `stage`
const stage = new PIXI.Container();

// Render a blank stage
renderer.render(stage);

const imagePath = './images/canva.jpg';
const birdImageList = [
  './images/frame-1.png',
  './images/frame-2.png',
  './images/frame-3.png',
  './images/frame-4.png',
];
PIXI.loader
  .add(birdImageList)
  .load(setup);

let counter = 0;
let sprite: PIXI.Sprite;
function setup() {
  sprite = new PIXI.Sprite();
  sprite.scale.x = 0.1;
  sprite.scale.y = 0.1;
  stage.addChild(sprite);
  requestAnimationFrame(draw);
}

function draw() {
  sprite.texture = PIXI.loader.resources[birdImageList[Math.floor(counter++ / 10) % 4]].texture;
  renderer.render(stage);
  requestAnimationFrame(draw);
}
