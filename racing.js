const canvas = document.getElementById("race-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player1 = {
  x: 100,
  y: canvas.height / 2-50,
  width: 50,
  height: 30,
  color: "red",
  speed: 0
};

const player2 = {
  x: 100,
  y: canvas.height / 2 +50,
  width: 50,
  height: 30,
  color: "blue",
  speed: 0
};

let leftPressed = false;
let rightPressed = false;

canvas.addEventListener("touchstart", function(e) {
  for (let touch of e.touches) {
    if (touch.clientX < canvas.width / 2) {
      leftPressed = true;
    } else {
      rightPressed = true;
    }
  }
});

canvas.addEventListener("touchend", function(e) {
  leftPressed = false;
  rightPressed = false;
});

function gameLoop() {

  if (leftPressed) {
    player1.speed += 0.2;
  }

  if (rightPressed) {
    player2.speed += 0.2;
  }

  if (!leftPressed) {
    player1.speed *= 0.9;
    if (player1.speed < 0.1) player1.speed = 0;
  }
  
  if (!rightPressed) {
    player2.speed *= 0.9;
    if (player2.speed < 0.1) player2.speed = 0;
  }
  
  player1.x += player1.speed;
  player2.x += player2.speed;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  
  requestAnimationFrame(gameLoop);
};

gameLoop();
