const canvas = document.getElementById("race-canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(`{ x: ${Math.round(x)}, y: ${Math.round(y)} },`);
});

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
trackImage.src = "track.png";

function drawTrackImage() {
  ctx.drawImage(trackImage, 0, 0, canvas.width, canvas.height);
}

const trackPath = [
racing.js:9 { x: 1320, y: 218 },
racing.js:9 { x: 1264, y: 273 },
2racing.js:9 { x: 43, y: 387 },
5racing.js:9 { x: 1333, y: 515 },
racing.js:9 { x: 304, y: 523 },
racing.js:9 { x: 871, y: 535 },
racing.js:9 { x: 913, y: 532 },
racing.js:9 { x: 960, y: 517 },
racing.js:9 { x: 993, y: 500 },
racing.js:9 { x: 1021, y: 475 },
racing.js:9 { x: 1042, y: 430 },
racing.js:9 { x: 1046, y: 393 },
racing.js:9 { x: 1039, y: 359 },
racing.js:9 { x: 1034, y: 340 },
racing.js:9 { x: 1023, y: 319 },
racing.js:9 { x: 994, y: 282 },
racing.js:9 { x: 969, y: 257 },
racing.js:9 { x: 938, y: 244 },
racing.js:9 { x: 915, y: 234 },
racing.js:9 { x: 888, y: 228 },
racing.js:9 { x: 859, y: 227 },
racing.js:9 { x: 830, y: 229 },
racing.js:9 { x: 789, y: 241 },
racing.js:9 { x: 750, y: 250 },
racing.js:9 { x: 715, y: 259 },
racing.js:9 { x: 688, y: 266 },
racing.js:9 { x: 668, y: 268 },
racing.js:9 { x: 625, y: 267 },
racing.js:9 { x: 602, y: 253 },
racing.js:9 { x: 573, y: 236 },
racing.js:9 { x: 557, y: 219 },
racing.js:9 { x: 541, y: 199 },
racing.js:9 { x: 528, y: 186 },
racing.js:9 { x: 509, y: 170 },
racing.js:9 { x: 486, y: 145 },
racing.js:9 { x: 471, y: 140 },
racing.js:9 { x: 446, y: 132 },
racing.js:9 { x: 430, y: 131 },
racing.js:9 { x: 404, y: 135 },
racing.js:9 { x: 374, y: 142 },
racing.js:9 { x: 359, y: 152 },
racing.js:9 { x: 343, y: 168 },
racing.js:9 { x: 332, y: 187 },
racing.js:9 { x: 326, y: 207 },
racing.js:9 { x: 315, y: 229 },
racing.js:9 { x: 300, y: 253 },
racing.js:9 { x: 287, y: 285 },
racing.js:9 { x: 273, y: 301 },
racing.js:9 { x: 255, y: 318 },
racing.js:9 { x: 239, y: 328 },
racing.js:9 { x: 212, y: 347 },
racing.js:9 { x: 191, y: 358 },
racing.js:9 { x: 170, y: 378 },
racing.js:9 { x: 161, y: 398 },
racing.js:9 { x: 157, y: 414 },
racing.js:9 { x: 156, y: 459 },
racing.js:9 { x: 165, y: 480 },
racing.js:9 { x: 180, y: 499 },
racing.js:9 { x: 212, y: 514 },
racing.js:9 { x: 241, y: 522 },
];

function drawTrackPathDebug() {
  ctx.fillStyle = "yellow";
  for (let point of trackPath) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
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
  drawTrackPathDebug();
  
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
