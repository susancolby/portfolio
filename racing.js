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

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  
  requestAnimationFrame(gameLoop);
};

gameLoop();
