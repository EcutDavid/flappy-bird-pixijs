const canvasWidthHeight = Math.min(Math.min(window.innerHeight, window.innerWidth), 512);
const GRAVITY = 9.8;
const GAME_SPEED_X = 40;
const BIRD_FRAME_LIST = [
  './images/frame-1.png',
  './images/frame-2.png',
  './images/frame-3.png',
  './images/frame-4.png',
];
const TUBE_POS_LIST = [
  canvasWidthHeight + 50,
  canvasWidthHeight + 250,
  canvasWidthHeight + 480
];
type Rectangle = {
  x: number;
  y: number;
  height: number;
  width: number;
}

const renderer = PIXI.autoDetectRenderer(canvasWidthHeight, canvasWidthHeight, { backgroundColor: 0xc1c2c4 });
// Add the canvas to the HTML document
document.body.appendChild(renderer.view);
// Create a container object called the `stage`
const stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle(0, 0, 1000, 1000);
renderer.render(stage);

PIXI.loader
  .add(BIRD_FRAME_LIST)
  .load(setup);

let counter = 0;

class Bird {
  private speedY: number = 0;
  private sprite = new PIXI.Sprite();
  private isDied: boolean;
  
  private textureCounter: number = 0;
  private updateTexture = () => {
    if (this.isDied) return;
    this.sprite.texture = PIXI.loader.resources[BIRD_FRAME_LIST[this.textureCounter++]].texture;
    
    if (this.textureCounter === BIRD_FRAME_LIST.length) this.textureCounter = 0;
  }

  updateSprite = () => {
    this.speedY += GRAVITY / 70;
    this.sprite.y += this.speedY;
    this.sprite.rotation = Math.atan(this.speedY / GAME_SPEED_X);

    let isCollide = false;
    this.tubeList.forEach(d => {
      const { x, y, width, height } = this.sprite;
      if(d.checkCollision({ x: x - width / 2, y: y - height / 2, width, height })) {
        isCollide = true;
      }
    });
    if (this.sprite.y < -this.sprite.height / 2 || this.sprite.y > canvasWidthHeight + this.sprite.height / 2) {
      isCollide = true;
    }

    if (isCollide) {
      this.onCollision();
      this.isDied = true;
    }
  }

  addSpeed(speedInc: number) {
    this.speedY += speedInc;
    this.speedY = Math.max(-GRAVITY, this.speedY);
  }

  reset() {
    this.sprite.x = canvasWidthHeight / 6;
    this.sprite.y = canvasWidthHeight / 2.5;
    this.speedY = 0;
    this.isDied = false;
  }
  
  constructor(stage: PIXI.Container, readonly tubeList: Tube[], readonly onCollision: () => void) {
    stage.addChild(this.sprite);
    this.sprite.anchor.set(0.5, 0.5);
    this.updateTexture();
    this.sprite.scale.x = 0.06;
    this.sprite.scale.y = 0.06;

    this.reset();

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

  checkCollision({x, y, width, height}: Rectangle) {
    if (!(x + width < this.x || this.x + this.tubeWidth < x || this.y < y)) {
      return true;
    }
    if (!(x + width < this.x || this.x + this.tubeWidth < x || y + height < this.y + this.innerDistance)) {
      return true;
    } 
    return false;
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

const tubeList = TUBE_POS_LIST.map(d => new Tube(stage, d));
let bird;

function setup() {
  bird = new Bird(stage, tubeList, () => {
    gameFailed = true;
    startButton.classList.remove('hide');
  });
  requestAnimationFrame(draw);
}

let started = false;
let gameFailed = false;
function draw() {
  if(started) {
    bird.updateSprite();
    if (!gameFailed) tubeList.forEach(d => d.update());
  }
  renderer.render(stage);
  requestAnimationFrame(draw);
}

const startButton = document.querySelector('#start');
startButton.addEventListener('click', () => {
  started = true;
  startButton.innerHTML = 'Retry';
  if (gameFailed) {
    tubeList.forEach((d, i) => d.reset(TUBE_POS_LIST[i]));
    gameFailed = false;
    bird.reset();
  }
  startButton.classList.add('hide');
});
