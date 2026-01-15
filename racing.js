const canvas = document.getElementById("race-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const trackRatio = 16 / 9;

  if (screenWidth / screenHeight > trackRatio) {
    canvas.height = screenHeight;
    canvas.width = screenHeight * trackRatio;
  } else {
    canvas.width = screenWidth;
    canvas.height = screenWidth / trackRatio;
  }
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const trackImage = new Image();
teackImage.src = "track.png";

function drawTrackImage() {
  ctx.drawImage(trackImage, 0, 0, canvas.width, canvas.height);
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
  
  drawTrackImage();
  
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

trackImage.onload = gameLoop;
