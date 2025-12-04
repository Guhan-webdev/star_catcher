import Phaser from 'phaser';
const startButton = document.getElementById('StartBtn');
const startMenu = document.getElementById('startMenu');
const gameStart = document.getElementById('gameCanvas');
const game_Over = document.getElementById('Score');
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
    this.platforms;
    this.player;
    this.cursor;
    this.stars;
    this.score = 0;
    this.scoreText;
    this.bombs;
    this.gameOver = false;
  };

  preload() {
    this.load.image('sky', 'src/assets/sky.png');
    this.load.image('ground', 'src/assets/platform.png');
    this.load.image('star', 'src/assets/star.png');
    this.load.image('bomb', 'src/assets/bomb.png');
    this.load.spritesheet('dude',
      'src/assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    )
  };

  collectStar(player, star) {

    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      var bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    };

  };

  hitBomb() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play('turn');
    this.gameOver = true;

    // 1. Select the elements specifically inside this function
    const gameOverMenu = document.getElementById('gameOver');
    const scoreTextElement = document.getElementById('ScoreDisplay'); // Assuming you used the HTML from the previous step

    // 2. Make the menu visible
    // (We remove the 'hidden' class we added in CSS)
    if (gameOverMenu) {
      gameOverMenu.classList.remove('hidden');
    }

    // 3. Update the text (Fixing the innerHTML typo)
    if (scoreTextElement) {
      scoreTextElement.innerHTML = 'Your Score: ' + this.score;
    }
  };
  
  create() {

    this.cursor = this.input.keyboard.createCursorKeys();
    this.add.image(400, 300, 'sky');
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({

      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1

    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.physics.add.collider(this.player, this.platforms);

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
    });
    this.physics.add.collider(this.stars, this.platforms);
    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    });

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this)
  };
  update() {
    if (this.cursor.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursor.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

  };
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'gameCanvas',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      // debug: true
    }
  },
  scene: [GameScene]

};

if (startButton) {
  startButton.addEventListener('click', () => {
    var game = new Phaser.Game(config);
    if (startMenu) {
      startMenu.style.display = 'none';
      gameStart.style.display = 'flex';
    }
  })
}
