// Optional configuration
// {antialias: boolean, transparent: boolean, resolution: number}
const renderer = PIXI.autoDetectRenderer(512, 512);
const GRAVITY = 9.8;
const GAME_SPEED_X = 5;
// renderer.autoResize = true;
// renderer.resize(512, 512);

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

class Bird {
  private speedY: number = 0;
  private sprite = new PIXI.Sprite();
  
  private textureCounter: number = 0;
  private updateTexture = () => {
    this.sprite.texture = PIXI.loader.resources[birdFrameList[this.textureCounter++]].texture;
    
    if (this.textureCounter === birdFrameList.length) this.textureCounter = 0;
  }

  private updateSprite = () => {
    this.speedY += GRAVITY / 70;
    this.sprite.y += this.speedY;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.rotation = Math.atan(this.speedY / GAME_SPEED_X);
  }

  addSpeed(speedInc: number) {
    this.speedY += speedInc;
    this.speedY = Math.max(-GRAVITY, this.speedY);
  }
  
  constructor(stage: PIXI.Container) {
    stage.addChild(this.sprite);
    this.sprite.scale.x = 0.1;
    this.sprite.scale.y = 0.1;
    this.sprite.x = 50;

    document.addEventListener('keydown', e => {
      // handle space
      if (e.keyCode == 32) this.addSpeed(-GRAVITY / 3);
    });
    stage.on('pointerdown', () => this.addSpeed(-GRAVITY / 3))

    setInterval(this.updateTexture, 200);
    setInterval(this.updateSprite, 1000 / 60);
  }
}

function setup() {
  const bird = new Bird(stage);
  requestAnimationFrame(draw);
}

function draw() {
  renderer.render(stage);
  requestAnimationFrame(draw);
}



