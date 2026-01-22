const canvas = document.getElementById("race-canvas");
const ctx = canvas.getContext("2d");

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let lastTime = performance.now();

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  // Canvas coordinates
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;

  // Convert back into IMAGE coordinates
  const imgX = (cx - offsetX) / scale;
  const imgY = (cy - offsetY) / scale;

  console.log(`{ x: ${Math.round(imgX)}, y: ${Math.round(imgY)} },`);
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (!trackImg.complete || trackImg.width === 0) return;

  scale = Math.min(
    canvas.width / trackImg.width,
    canvas.height / trackImg.height
  );

  offsetX = (canvas.width - trackImg.width * scale) / 2;
  offsetY = (canvas.height - trackImg.height * scale) / 2;
}


function scalePoint(p) {
  return {
    x: p.x * scale + offsetX,
    y: p.y * scale + offsetY
  };
}

window.addEventListener("resize", resizeCanvas);

const trackImg = new Image();
trackImg.src = "track.png";

function drawTrackImg() {
  ctx.drawImage(
  trackImg,
  offsetX,
  offsetY,
  trackImg.width * scale,
  trackImg.height * scale
);
}

const trackPath = [
  { x: 3540, y: 6576 },
  { x: 3793, y: 6549 },
  { x: 4101, y: 6536 },
  { x: 4368, y: 6563 },
  { x: 4889, y: 6563 },
  { x: 5316, y: 6563 },
  { x: 5703, y: 6563 },
  { x: 6118, y: 6576 },
  { x: 6759, y: 6576 },
  { x: 7159, y: 6576 },
  { x: 7774, y: 6549 },
  { x: 8201, y: 6589 },
  { x: 8642, y: 6589 },
  { x: 9176, y: 6589 },
  { x: 9617, y: 6536 },
  { x: 10285, y: 6536 },
  { x: 10859, y: 6536 },
  { x: 11287, y: 6536 },
  { x: 11848, y: 6496 },
  { x: 12155, y: 6416 },
  { x: 12502, y: 6269 },
  { x: 12716, y: 6162 },
  { x: 12783, y: 6082 },
  { x: 12876, y: 5815 },
  { x: 12916, y: 5601 },
  { x: 12943, y: 5294 },
  { x: 12970, y: 4880 },
  { x: 12996, y: 4613 },
  { x: 12876, y: 4399 },
  { x: 12823, y: 4185 },
  { x: 12649, y: 3771 },
  { x: 12542, y: 3678 },
  { x: 12275, y: 3397 },
  { x: 12048, y: 3304 },
  { x: 11781, y: 3130 },
  { x: 11500, y: 3050 },
  { x: 11313, y: 2996 },
  { x: 10980, y: 3023 },
  { x: 10859, y: 3023 },
  { x: 10512, y: 3063 },
  { x: 10352, y: 3130 },
  { x: 10111, y: 3183 },
  { x: 9898, y: 3263 },
  { x: 9577, y: 3317 },
  { x: 9190, y: 3370 },
  { x: 8923, y: 3424 },
  { x: 8535, y: 3491 },
  { x: 8175, y: 3504 },
  { x: 8001, y: 3450 },
  { x: 7547, y: 3197 },
  { x: 7333, y: 3117 },
  { x: 7039, y: 2956 },
  { x: 6772, y: 2769 },
  { x: 6558, y: 2462 },
  { x: 6345, y: 2235 },
  { x: 6171, y: 2075 },
  { x: 5997, y: 1968 },
  { x: 5904, y: 1914 },
  { x: 5650, y: 1808 },
  { x: 5476, y: 1781 },
  { x: 5396, y: 1781 },
  { x: 5156, y: 1821 },
  { x: 4889, y: 1874 },
  { x: 4742, y: 1954 },
  { x: 4515, y: 2168 },
  { x: 4394, y: 2382 },
  { x: 4288, y: 2502 },
  { x: 4141, y: 2689 },
  { x: 3994, y: 2930 },
  { x: 3954, y: 3023 },
  { x: 3860, y: 3290 },
  { x: 3753, y: 3477 },
  { x: 3673, y: 3611 },
  { x: 3526, y: 3824 },
  { x: 3379, y: 4038 },
  { x: 3192, y: 4158 },
  { x: 2832, y: 4412 },
  { x: 2698, y: 4532 },
  { x: 2511, y: 4693 },
  { x: 2311, y: 4933 },
  { x: 2150, y: 5160 },
  { x: 2084, y: 5507 },
  { x: 2150, y: 6028 },
  { x: 2297, y: 6242 },
  { x: 2444, y: 6402 },
  { x: 2818, y: 6496 },
  { x: 3139, y: 6549 },
];

const segmentLengths = [];
let totalPathLength = 0;

for (let i = 0; i < trackPath.length - 1; i++) {
  const dx = trackPath[i + 1].x - trackPath[i].x;
  const dy = trackPath[i + 1].y - trackPath[i].y;
  const len = Math.hypot(dx, dy);
  segmentLengths.push(len);
  totalPathLength += len;
}

function drawTrackPath() {
  ctx.fillStyle = "magenta";
  for (const p of trackPath) {
    const sp = scalePoint(p);
    ctx.fillRect(sp.x - 2, sp.y - 2, 4, 4);
  }
}

const player1 = {
  distance: 0,      // distance along the full track
  velocity: 0,      // current speed along the track
  accel: 0.02,      // how fast the car accelerates
  maxSpeed: 6,      // optional cap (recommended)
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

function gameLoop(now) {
  const dt = (now - lastTime) / 16.666; // normalize to ~60fps
  lastTime = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawTrackImg();
  drawTrackPath();
  
  if (leftPressed) {
  player1.velocity += player1.accel;
  }


  if (rightPressed) {
    player2.speed += 0.2;
  }

  if (!leftPressed) {
  player1.velocity *= 0.95; // friction
  if (player1.velocity < 0.01) player1.velocity = 0;
}

  
  if (!rightPressed) {
    player2.speed *= 0.9;
    if (player2.speed < 0.1) player2.speed = 0;
  }
  
  player1.velocity = Math.min(player1.velocity, player1.maxSpeed);

player1.distance += player1.velocity;

// Loop path
if (player1.distance > totalPathLength) {
  player1.distance -= totalPathLength;
}

// Find segment
let d = player1.distance;
let segmentIndex = 0;

while (
  segmentIndex < segmentLengths.length - 1 &&
  d > segmentLengths[segmentIndex]
) {
  d -= segmentLengths[segmentIndex];
  segmentIndex++;
}


// Interpolate
const p1 = trackPath[segmentIndex];
const p2 = trackPath[segmentIndex + 1];
const t = d / segmentLengths[segmentIndex];

const pos = {
  x: p1.x + (p2.x - p1.x) * t,
  y: p1.y + (p2.y - p1.y) * t
};

const sp = scalePoint(pos);

ctx.fillStyle = player1.color;
ctx.fillRect(
  sp.x - player1.width / 2,
  sp.y - player1.height / 2,
  player1.width,
  player1.height
);


  player2.x += player2.speed;

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
  
  requestAnimationFrame(gameLoop);
};

trackImg.onload = () => {
  resizeCanvas();
  gameLoop();
};
