const canvas = document.getElementById("race-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawCloudTrack() {
  ctx.strokeStyle = "#555"; // track color
  ctx.lineWidth = 24;       // track width
  ctx.lineCap = "round";    // smooth line ends
  ctx.lineJoin = "round";   // smooth corners

  ctx.beginPath();

  // Start at bottom-left
  ctx.moveTo(100, canvas.height - 100);

  // Left side curve up to first small top bump
  ctx.bezierCurveTo(100, canvas.height / 2 + 50, 150, 100, 250, 100);

  // Small left top bump flowing to center top bump
  ctx.bezierCurveTo(300, 50, 400, 50, 500, 100);

  // Center top large bump flowing to right top bump
  ctx.bezierCurveTo(600, 150, 700, 150, 750, 100);

  // Small right top bump flowing down right side
  ctx.bezierCurveTo(850, 50, 900, canvas.height / 2 + 50, 900, canvas.height - 100);

  // Flat bottom back to start
  ctx.lineTo(100, canvas.height - 100);

  ctx.closePath();
  ctx.stroke();
}

const player1 = {
  x: 100,
  y: (canvas.height / 2) - 50,
  width: 50,
  height: 30,
  color: "red",
  speed: 0
};

const player2 = {
  x: 100,
  y: (canvas.height / 2) + 50,
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

  for (let touch of e.touches) {
    if (touch.clientX < canvas.width / 2) {
      leftPressed = true;
    } else {
      rightPressed = true;
    }
  }
});

function gameLoop() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCloudTrack();
  
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
  
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  
  requestAnimationFrame(gameLoop);
};

gameLoop();
