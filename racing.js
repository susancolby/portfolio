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
  { x: 1320, y: 218 },
  { x: 1264, y: 273 },
  { x: 1333, y: 515 },
  { x: 304, y: 523 },
  { x: 871, y: 535 },
  { x: 913, y: 532 },
  { x: 960, y: 517 },
  { x: 993, y: 500 },
  { x: 1021, y: 475 },
  { x: 1042, y: 430 },
  { x: 1046, y: 393 },
  { x: 1039, y: 359 },
  { x: 1034, y: 340 },
  { x: 1023, y: 319 },
  { x: 994, y: 282 },
  { x: 969, y: 257 },
  { x: 938, y: 244 },
  { x: 915, y: 234 },
  { x: 888, y: 228 },
  { x: 859, y: 227 },
  { x: 830, y: 229 },
  { x: 789, y: 241 },
  { x: 750, y: 250 },
  { x: 715, y: 259 },
  { x: 688, y: 266 },
  { x: 668, y: 268 },
  { x: 625, y: 267 },
  { x: 602, y: 253 },
  { x: 573, y: 236 },
  { x: 557, y: 219 },
  { x: 541, y: 199 },
  { x: 528, y: 186 },
  { x: 509, y: 170 },
  { x: 486, y: 145 },
  { x: 471, y: 140 },
  { x: 446, y: 132 },
  { x: 430, y: 131 },
  { x: 404, y: 135 },
  { x: 374, y: 142 },
  { x: 359, y: 152 },
  { x: 343, y: 168 },
  { x: 332, y: 187 },
  { x: 326, y: 207 },
  { x: 315, y: 229 },
  { x: 300, y: 253 },
  { x: 287, y: 285 },
  { x: 273, y: 301 },
  { x: 255, y: 318 },
  { x: 239, y: 328 },
  { x: 212, y: 347 },
  { x: 191, y: 358 },
  { x: 170, y: 378 },
  { x: 161, y: 398 },
  { x: 157, y: 414 },
  { x: 156, y: 459 },
  { x: 165, y: 480 },
  { x: 180, y: 499 },
  { x: 212, y: 514 },
  { x: 241, y: 522 }
];

function getPointOnPath(index, t) {
  const p1 = trackPath[index];
  const p2 = trackPath[index + 1];

  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}


function drawTrackPathDebug() {
  ctx.fillStyle = "magenta";
  for (let point of trackPath) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

const player1 = {
  pathIndex: 0,      // which point on the path
  pathT: 0,          // how far to the next point (0 → 1)
  speed: 0.002,      // path speed (small number!)
  width: 50,
  height: 30,
  color: "red"
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
  
  player1.pathT += player1.speed;

if (player1.pathT >= 1) {
  player1.pathT = 0;
  player1.pathIndex++;

  // Loop the track
  if (player1.pathIndex >= trackPath.length - 1) {
    player1.pathIndex = 0;
  }
}

const pos = getPointOnPath(player1.pathIndex, player1.pathT);

  player2.x += player2.speed;
  
  ctx.fillStyle = player1.color;
  ctx.fillRect(
  pos.x - player1.width / 2,
  pos.y - player1.height / 2,
  player1.width,
  player1.height
  );

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  
  requestAnimationFrame(gameLoop);
};

gameLoop();
