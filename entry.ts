const canvasWidthHeight = Math.min(Math.min(window.innerHeight, window.innerWidth), 512);
const renderer = PIXI.autoDetectRenderer(canvasWidthHeight, canvasWidthHeight);
const GRAVITY = 9.8;
const GAME_SPEED_X = 25;

let started = false;
const startButton = document.querySelector('#start');
startButton.addEventListener('click', () => {
  started = true;
  startButton.classList.add('hide');
});

// Add the canvas to the HTML document
document.body.appendChild(renderer.view);

// Create a container object called the `stage`
const stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle(0, 0, 1000, 1000);
renderer.render(stage);

const imagePath = './images/canva.jpg';
const birdFrameList = [
  './images/frame-1.png',
  './images/frame-2.png',
  './images/frame-3.png',
  './images/frame-4.png',
];
PIXI.loader
  .add(birdFrameList)
  .load(setup);

let counter = 0;
type Rectangle = {
  x: number;
  y: number;
  height: number;
  width: number;
}

class Bird {
  private speedY: number = 0;
  private sprite = new PIXI.Sprite();
  
  private textureCounter: number = 0;
  private updateTexture = () => {
    this.sprite.texture = PIXI.loader.resources[birdFrameList[this.textureCounter++]].texture;
    
    if (this.textureCounter === birdFrameList.length) this.textureCounter = 0;
  }

  updateSprite = () => {
    this.speedY += GRAVITY / 70;
    this.sprite.y += this.speedY;
    this.sprite.rotation = Math.atan(this.speedY / GAME_SPEED_X);
  }

  addSpeed(speedInc: number) {
    this.speedY += speedInc;
    this.speedY = Math.max(-GRAVITY, this.speedY);
  }
  
  constructor(stage: PIXI.Container, tubeList: Tube[], onCollision: () => void) {
    stage.addChild(this.sprite);
    this.sprite.anchor.set(0.5, 0.5);
    this.updateTexture();
    this.sprite.scale.x = 0.08;
    this.sprite.scale.y = 0.08;
    
    this.sprite.x = canvasWidthHeight / 6;
    this.sprite.y = canvasWidthHeight / 2.5;
    document.addEventListener('keydown', e => {
      if (e.keyCode == 32) this.addSpeed(-GRAVITY / 3);
    });
    stage.on('pointerdown', () => this.addSpeed(-GRAVITY / 3))

    setInterval(this.updateTexture, 200);
  }
}

class Tube {
  private x: number;
  private y: number;
  private innerDistance = 80;
  private tubeWidth = 20;
  
  private sprite = new PIXI.Graphics();

  reset(x: number = canvasWidthHeight + 20) {
    this.x = x;
    
    const tubeMinHeight = 60;
    const randomNum = Math.random() * (canvasWidthHeight - 2 * tubeMinHeight - this.innerDistance);
    this.y = tubeMinHeight + randomNum;
  }

  update() {
    this.x -= GAME_SPEED_X / 60;
    if (this.x < -this.tubeWidth) this.reset();
    
    this.sprite.clear();
    this.sprite.beginFill(0xffffff, 1);
    this.sprite.drawRect(
      this.x,
      0,
      this.tubeWidth,
      this.y
    );
    this.sprite.drawRect(
      this.x,
      this.y + this.innerDistance,
      this.tubeWidth,
      canvasWidthHeight
    );
    this.sprite.endFill();
  }

  constructor(stage: PIXI.Container, x: number) {
    stage.addChild(this.sprite);
    this.reset(x);
  }
}

const tubeYList = [
  canvasWidthHeight + 50, 
  canvasWidthHeight + 250,
  canvasWidthHeight + 480
];
const tubeList = tubeYList.map(d => new Tube(stage, d));
let bird;

function setup() {
  bird = new Bird(stage, tubeList, () => gameFailed = true);
  requestAnimationFrame(draw);
}

let gameFailed = false;
function draw() {
  if(started) {
    bird.updateSprite();
    if (!gameFailed) tubeList.forEach(d => d.update());
  }
  renderer.render(stage);
  requestAnimationFrame(draw);
}



