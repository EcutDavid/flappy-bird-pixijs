var stageWidthHeight = Math.min(Math.min(window.innerHeight, window.innerHeight), 512);
var renderer = PIXI.autoDetectRenderer(stageWidthHeight, stageWidthHeight);
var GRAVITY = 9.8;
var GAME_SPEED_X = 5;
var started = false;
var startButton = document.querySelector('#start');
startButton.addEventListener('click', function () { return started = true; });
// Add the canvas to the HTML document
document.body.appendChild(renderer.view);
// Create a container object called the `stage`
var stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle(0, 0, 1000, 1000);
renderer.render(stage);
var imagePath = './images/canva.jpg';
var birdFrameList = [
    './images/frame-1.png',
    './images/frame-2.png',
    './images/frame-3.png',
    './images/frame-4.png',
];
PIXI.loader
    .add(birdFrameList)
    .load(setup);
var counter = 0;
var Bird = (function () {
    function Bird(stage) {
        var _this = this;
        this.speedY = 0;
        this.sprite = new PIXI.Sprite();
        this.textureCounter = 0;
        this.updateTexture = function () {
            _this.sprite.texture = PIXI.loader.resources[birdFrameList[_this.textureCounter++]].texture;
            if (_this.textureCounter === birdFrameList.length)
                _this.textureCounter = 0;
        };
        this.updateSprite = function () {
            _this.speedY += GRAVITY / 70;
            _this.sprite.y += _this.speedY;
            _this.sprite.anchor.set(0.5, 0.5);
            _this.sprite.rotation = Math.atan(_this.speedY / GAME_SPEED_X);
        };
        stage.addChild(this.sprite);
        this.sprite.scale.x = 0.1;
        this.sprite.scale.y = 0.1;
        this.sprite.x = stageWidthHeight / 6;
        this.sprite.y = stageWidthHeight / 2.5;
        document.addEventListener('keydown', function (e) {
            // handle space
            if (e.keyCode == 32)
                _this.addSpeed(-GRAVITY / 3);
        });
        stage.on('pointerdown', function () { return _this.addSpeed(-GRAVITY / 3); });
        setInterval(this.updateTexture, 200);
    }
    Bird.prototype.addSpeed = function (speedInc) {
        this.speedY += speedInc;
        this.speedY = Math.max(-GRAVITY, this.speedY);
    };
    return Bird;
}());
var bird;
function setup() {
    bird = new Bird(stage);
    requestAnimationFrame(draw);
}
function draw() {
    if (started) {
        bird.updateSprite();
    }
    renderer.render(stage);
    requestAnimationFrame(draw);
}
