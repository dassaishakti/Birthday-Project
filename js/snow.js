const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const snowflakes = [];
const blossom = [];

for (let i = 0; i < 100; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    d: Math.random() + 1,
  });
}

for (let i = 0; i < 40; i++) {
  blossom.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    s: Math.random() * 15 + 10,
    speed: Math.random() * 0.5 + 0.3,
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();

  for (let flake of snowflakes) {
    ctx.moveTo(flake.x, flake.y);
    ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2, true);
  }
  ctx.fill();

  blossom.forEach(b => {
    ctx.fillStyle = "rgba(255,182,193,0.8)";
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.s / 5, 0, Math.PI * 2);
    ctx.fill();
  });

  update();
}

function update() {
  snowflakes.forEach(flake => {
    flake.y += Math.pow(flake.d, 2) + 1;
    if (flake.y > canvas.height) {
      flake.y = 0;
      flake.x = Math.random() * canvas.width;
    }
  });

  blossom.forEach(b => {
    b.y += b.speed;
    b.x += Math.sin(b.y / 30);
    if (b.y > canvas.height) {
      b.y = 0;
      b.x = Math.random() * canvas.width;
    }
  });
}

function animate() {
  draw();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
