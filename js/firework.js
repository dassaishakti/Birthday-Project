// const canvas = document.getElementById('fireworksCanvas');
// const ctx = canvas.getContext('2d');
// canvas.width = innerWidth;
// canvas.height = innerHeight;

// let particles = [];

// function random(min, max) {
//   return Math.random() * (max - min) + min;
// }

// function createFirework() {
//   const x = random(100, canvas.width - 100);
//   const y = random(50, canvas.height/2);
//   const colors = ['#ff66a3','#ff8ac6','#ffcce0','#fff3b0','#ff80b0'];

//   for (let i=0;i<30;i++){
//     particles.push({
//       x: x,
//       y: y,
//       vx: random(-3,3),
//       vy: random(-5,0),
//       alpha: 1,
//       color: colors[Math.floor(random(0,colors.length))]
//     });
//   }
// }

// function animateFireworks() {
//   ctx.clearRect(0,0,canvas.width,canvas.height);
//   particles.forEach((p, i)=>{
//     ctx.globalAlpha = p.alpha;
//     ctx.fillStyle = p.color;
//     ctx.beginPath();
//     ctx.arc(p.x,p.y,3,0,Math.PI*2);
//     ctx.fill();
//     p.x += p.vx;
//     p.y += p.vy;
//     p.vy += 0.05; // gravity
//     p.alpha -= 0.02;
//     if (p.alpha <=0) particles.splice(i,1);
//   });
//   requestAnimationFrame(animateFireworks);
// }

// function startFireworks() {
//   setInterval(createFirework, 800);
//   animateFireworks();
// }

// window.addEventListener('resize', () => {
//   canvas.width = innerWidth;
//   canvas.height = innerHeight;
// });
const container = document.getElementById('fireworks-container');
const FIREWORK_BURST_PARTICLES = 50; // More particles for a denser burst
const GRAVITY = 0.05;
const DRAG = 0.98; // Air resistance for particles
const SHELL_ASCENT_SPEED_RANGE = { min: 4, max: 7 }; // Initial speed of the rocket
const PARTICLE_INITIAL_SPEED_RANGE = { min: 2, max: 8 }; // Speed of particles after explosion
const PARTICLE_SIZE_RANGE = { min: 3, max: 6 }; // Initial size of particles
const PARTICLE_LIFESPAN_RANGE = { min: 60, max: 120 }; // frames
const TRAIL_LENGTH = 10; // How many previous positions to store for a trail
const TRAIL_FADE_START_AGE_RATIO = 0.6; // Start fading trail after this ratio of lifespan

const COLORS = [
    'hsl(15, 100%, 50%)', // Orange (Free Fire Red-Orange)
    'hsl(60, 100%, 50%)', // Yellow
    'hsl(200, 100%, 50%)',// Blue
    'hsl(300, 100%, 60%)',// Purple/Pink
    'hsl(120, 100%, 50%)' // Green
];

// --- Utility Functions ---
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- Particle Class ---
class Particle {
    constructor(x, y, vx, vy, color, initialSize, lifespan) {
        this.element = document.createElement('div');
        this.element.className = 'particle';
        this.element.style.backgroundColor = color;
        this.element.style.color = color; // For glow
        this.element.style.width = `${initialSize}px`;
        this.element.style.height = `${initialSize}px`;
        container.appendChild(this.element);

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.lifespan = lifespan;
        this.age = 0;
        this.initialSize = initialSize;
        this.history = []; // For trail effect
        this.color = color;
    }

    update() {
        this.vy += GRAVITY;
        this.vx *= DRAG;
        this.vy *= DRAG;
        this.x += this.vx;
        this.y += this.vy;
        this.age++;

        // Store current position for trail
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > TRAIL_LENGTH) {
            this.history.shift();
        }

        // Calculate opacity based on age (fade out)
        let opacity = 1;
        if (this.age / this.lifespan > TRAIL_FADE_START_AGE_RATIO) {
            opacity = 1 - ((this.age / this.lifespan - TRAIL_FADE_START_AGE_RATIO) / (1 - TRAIL_FADE_START_AGE_RATIO));
            if (opacity < 0) opacity = 0;
        }

        // Calculate size based on age (shrink)
        const size = this.initialSize * (1 - (this.age / this.lifespan));
        
        // Update element style
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.opacity = opacity;
        this.element.style.width = `${size}px`;
        this.element.style.height = `${size}px`;

        // Update trail (simple fading trail with multiple div elements or canvas for better performance)
        // For simplicity, we are drawing directly on the particle's glow, or we'd need more divs/canvas.
        // A proper trail would involve drawing many semi-transparent dots for each particle's past positions.
        // For this example, we'll let the particle itself handle its glow, making it a "glowing dot" trail.
        // If you want actual distinct trail segments, you'd need to create child elements or use canvas.
    }

    isAlive() {
        return this.age < this.lifespan;
    }

    destroy() {
        this.element.remove();
    }
}

// --- Firework Shell Class ---
class Firework {
    constructor() {
        this.startX = random(window.innerWidth * 0.1, window.innerWidth * 0.9);
        this.startY = window.innerHeight;
        this.targetY = random(window.innerHeight * 0.1, window.innerHeight * 0.4); // Explode higher
        this.color = choose(COLORS);

        this.shellElement = document.createElement('div');
        this.shellElement.className = 'firework-shell';
        this.shellElement.style.left = `${this.startX}px`;
        this.shellElement.style.top = `${this.startY}px`;
        container.appendChild(this.shellElement);

        this.currentY = this.startY;
        this.speed = random(SHELL_ASCENT_SPEED_RANGE.min, SHELL_ASCENT_SPEED_RANGE.max);
        this.phase = 'ascending'; // 'ascending', 'bursting'
        this.particles = [];
        this.shellOpacity = 1;
    }

    update() {
        if (this.phase === 'ascending') {
            this.currentY -= this.speed;
            this.shellElement.style.top = `${this.currentY}px`;
            this.shellOpacity -= 0.01; // Fade shell slightly as it rises
            if(this.shellOpacity < 0) this.shellOpacity = 0;
            this.shellElement.style.opacity = this.shellOpacity;


            // Check if reached target
            if (this.currentY <= this.targetY) {
                this.phase = 'bursting';
                this.shellElement.remove(); // Remove the shell div
                this.burst();
            }
        } else if (this.phase === 'bursting') {
            // Update individual particles
            this.particles = this.particles.filter(p => {
                p.update();
                return p.isAlive();
            });

            if (this.particles.length === 0) {
                this.phase = 'finished';
            }
        }
    }

    burst() {
        for (let i = 0; i < FIREWORK_BURST_PARTICLES; i++) {
            const angle = random(0, 2 * Math.PI);
            const speed = random(PARTICLE_INITIAL_SPEED_RANGE.min, PARTICLE_INITIAL_SPEED_RANGE.max);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const initialSize = random(PARTICLE_SIZE_RANGE.min, PARTICLE_SIZE_RANGE.max);
            const lifespan = random(PARTICLE_LIFESPAN_RANGE.min, PARTICLE_LIFESPAN_RANGE.max);
            
            this.particles.push(new Particle(this.startX, this.targetY, vx, vy, this.color, initialSize, lifespan));
        }
    }

    isFinished() {
        return this.phase === 'finished';
    }
}

// --- Main Animation Loop ---
let activeFireworks = [];

function animateFireworks() {
    activeFireworks = activeFireworks.filter(fw => {
        fw.update();
        if (fw.isFinished()) {
            // All particles removed by Particle.destroy()
            return false;
        }
        return true;
    });

    requestAnimationFrame(animateFireworks);
}

// Launch a new firework periodically
function launchNewFirework() {
    activeFireworks.push(new Firework());
}

// Start the animation and initial launches
animateFireworks();
setInterval(launchNewFirework, 1000); // Launch a new firework every 1 second
