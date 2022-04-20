window.addEventListener("load", function () {
  const canvas = document.querySelector("#icythein");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.maxFrame = 8;
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.vy = 0;
      this.gravity = 1;
    }
    draw(context) {
      // context.strokeStyle = "white";
      // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2,
      //   this.y + this.height / 2,
      //   this.width / 2,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
      // context.strokeStyle = "aqua";
      // context.beginPath();
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();
      // context.fillStyle = "cornflowerblue";
      // context.fillRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach((puppyDawg) => {
        const dx =
          puppyDawg.x + puppyDawg.width / 2 - (this.x + this.width / 2);
        const dy =
          puppyDawg.y + puppyDawg.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < puppyDawg.width / 2 + this.width / 2) {
          gameOver = true;
        }
      });
      // this is the sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      // these are the controls of the sprite
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        this.vy -= 32;
      } else {
        this.speed = 0;
      }
      // horizontal movement
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;
      // vertical movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.gravity;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById("backgroundImage");
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 7;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width - this.speed,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById("enemyImage");
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 8;
      this.markedForDeath = false;
    }
    draw(context) {
      // context.strokeStyle = "white";
      // context.strokeRect(this.x, this.y, this.width, this.height);
      // context.beginPath();
      // context.arc(
      //   this.x + this.width / 2,
      //   this.y + this.height / 2,
      //   this.width / 2,
      //   0,
      //   Math.PI * 2
      // );
      // context.stroke();
      // context.strokeStyle = "aqua";
      // context.beginPath();
      // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      // context.stroke();
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markedForDeath = true;
        score++;
      }
    }
  }

  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      console.log(enemies);
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((boobie) => {
      boobie.draw(ctx);
      boobie.update(deltaTime);
    });
    enemies = enemies.filter((boobie) => !boobie.markedForDeath);
  }

  function displayStatusText(context) {
    context.font = "40px Helvetica";
    context.fillStyle = "cornflowerblue";
    context.fillText("Score: " + score, 20, 50);
    context.fillStyle = "papayawhip";
    context.fillText("Score: " + score, 22, 52);
    if (gameOver) {
      context.textAlign = "center";
      context.font = "80px Helvetica";
      context.fillStyle = "cornflowerblue";
      context.fillText(
        "You Suck!!!! " + score,
        canvas.width / 2,
        canvas.height / 2
      );
      context.fillStyle = "papayawhip";
      context.fillText(
        "You Suck!!!! " + score,
        canvas.width / 2 + 2,
        canvas.height / 2 + 2
      );
    }
  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);

  // const enemy1 = new Enemy(canvas.width, canvas.height);
  // player.draw(ctx);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    // background.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});

// the meaning of life is to find your gift. The purpose of life is to give it away
