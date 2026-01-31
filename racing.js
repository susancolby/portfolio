const canvas = document.getElementById("race-canvas");
const ctx = canvas.getContext("2d");
canvas.style.touchAction = "none";

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let lastTime = performance.now();

/* =========================
   CLICK LOGGER (for path)
========================= */
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;
  const imgX = (cx - offsetX) / scale;
  const imgY = (cy - offsetY) / scale;
  console.log(`{ x: ${Math.round(imgX)}, y: ${Math.round(imgY)} },`);
});

/* =========================
   RESIZE + SCALE
========================= */
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

window.addEventListener("resize", resizeCanvas);

function scalePoint(p) {
  return {
    x: p.x * scale + offsetX,
    y: p.y * scale + offsetY
  };
}

/* =========================
   TRACK IMAGE
========================= */
function drawTrackImg() {
  if (!trackImg.complete || trackImg.width === 0) return;

  ctx.drawImage(
    trackImg,
    offsetX,
    offsetY,
    trackImg.width * scale,
    trackImg.height * scale
  );
}

/* =========================
   TRACK PATH (unchanged)
========================= */
const trackPath = [ /* your full path array here */ ];

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
  ctx.strokeStyle = "magenta";
  ctx.lineWidth = 2;
  ctx.beginPath();

  const start = scalePoint(trackPath[0]);
  ctx.moveTo(start.x, start.y);

  for (let i = 1; i < trackPath.length; i++) {
    const sp = scalePoint(trackPath[i]);
    ctx.lineTo(sp.x, sp.y);
  }

  ctx.stroke();
}

/* =========================
   PLAYERS
========================= */
const player1 = {
  distance: 0,
  velocity: 0,
  accel: 0.015,
  maxSpeed: 4,
  width: 50,
  height: 30,
  color: "red"
};

const player2 = {
  x: 100,
  y: 200,
  width: 50,
  height: 30,
  color: "blue",
  speed: 0
};

/* =========================
   NEW TOUCH INPUT SYSTEM
========================= */
let leftPressed = false;
let rightPressed = false;
const activeTouches = {};

function updateButtonsFromTouches(rect) {
  leftPressed = false;
  rightPressed = false;
  for (const id in activeTouches) {
    if (activeTouches[id].isLeft) leftPressed = true;
    else rightPressed = true;
  }
}

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  for (const touch of e.changedTouches) {
    const x = touch.clientX - rect.left;
    activeTouches[touch.identifier] = {
      x,
      isLeft: x < rect.width / 2
    };
  }
  updateButtonsFromTouches(rect);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  for (const touch of e.changedTouches) {
    const x = touch.clientX - rect.left;
    if (activeTouches[touch.identifier]) {
      activeTouches[touch.identifier].x = x;
      activeTouches[touch.identifier].isLeft = x < rect.width / 2;
    }
  }
  updateButtonsFromTouches(rect);
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    delete activeTouches[touch.identifier];
  }
  updateButtonsFromTouches(canvas.getBoundingClientRect());
}, { passive: false });

canvas.addEventListener("touchcancel", (e) => {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    delete activeTouches[touch.identifier];
  }
  updateButtonsFromTouches(canvas.getBoundingClientRect());
}, { passive: false });

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  if (e.clientX - rect.left < rect.width / 2) leftPressed = true;
  else rightPressed = true;
});
window.addEventListener("mouseup", () => {
  leftPressed = false;
  rightPressed = false;
});

/* =========================
   GAME LOOP (REPLACED)
========================= */
function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 16.666, 5);
  lastTime = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTrackImg();
  drawTrackPath();

  if (leftPressed) {
    player1.velocity += player1.accel * dt;
  }

  player1.velocity *= Math.pow(0.98, dt);
  if (!leftPressed && player1.velocity < 0.01) {
  player1.velocity = 0;
}


  player1.velocity = Math.min(player1.velocity, player1.maxSpeed);
  player1.distance += player1.velocity * dt;

  if (player1.distance > totalPathLength) {
    player1.distance -= totalPathLength;
  }

  let d = player1.distance;
  let segmentIndex = 0;
  while (segmentIndex < segmentLengths.length - 1 && d > segmentLengths[segmentIndex]) {
    d -= segmentLengths[segmentIndex];
    segmentIndex++;
  }

  const p1 = trackPath[segmentIndex];
  const p2 = trackPath[(segmentIndex + 1) % trackPath.length];
  const segLen = segmentLengths[segmentIndex] || 1;
  const t = d / segLen;

  const pos = {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };

  const sp = scalePoint(pos);
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

  ctx.save();
  ctx.translate(sp.x, sp.y);
  ctx.rotate(angle);
  ctx.fillStyle = player1.color;
  ctx.fillRect(-player1.width / 2, -player1.height / 2, player1.width, player1.height);
  ctx.restore();

  if (rightPressed) player2.speed += 0.2;
  else player2.speed *= 0.9;

  player2.x += player2.speed;
  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

  requestAnimationFrame(gameLoop);
}

trackImg.onload = () => {
  resizeCanvas();
  requestAnimationFrame(gameLoop);
};
