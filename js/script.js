// --- Heart Animation Logic (ALWAYS ACTIVE - Cursor Effect) ---
let lastHeartTime = 0;
const heartCreationInterval = 50; 

function createHeart(x, y) {
    const currentTime = Date.now();
    
    // Throttle heart creation for performance
    if (currentTime - lastHeartTime < heartCreationInterval) {
        return;
    }
    lastHeartTime = currentTime;

    const heart = document.createElement('div');
    heart.classList.add('heart');

    // Position the heart
    heart.style.left = `${x - 7.5}px`;
    heart.style.top = `${y - 7.5}px`;

    document.body.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// 1. Mouse Event Listener (for laptops) - Fires on the whole page
document.body.addEventListener('mousemove', (event) => {
    createHeart(event.clientX, event.clientY);
});

// 2. Touch Event Listener (for mobile) - Fires on the whole page
document.body.addEventListener('touchmove', (event) => {
    event.preventDefault(); 
    
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        createHeart(touch.clientX, touch.clientY);
    }
}, { passive: false });


// --- Standard Page Functions & Constants ---

// NEW CONSTANTS (Element References)
const surpriseBtn = document.getElementById("surpriseBtn");
const popup = document.getElementById("popup");
const cake = document.getElementById("cake");
const birthdayText = document.getElementById("birthdayText");
const birthdayWishes = document.getElementById("birthdayWishes");
const backBtn = document.getElementById("backBtn"); 
const balloonContainer = document.getElementById("balloon-container");


function createStars(count = 100) {
    // Creates star elements for night sky effect
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = Math.random() * window.innerHeight + 'px';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.width = star.style.height = Math.random() * 2 + 1 + 'px';
        document.body.appendChild(star);
    }
}


// --- CRITICAL FIX: Initial Page Load Function ---
function showInitialPopup() {
    // 1. Ensure all SURPRISE elements are fully hidden at the start 
    if (cake) { cake.classList.add("hidden"); cake.classList.remove("show"); }
    if (birthdayText) { birthdayText.classList.add("hidden"); birthdayText.classList.remove("show"); }
    if (birthdayWishes) { birthdayWishes.classList.add("hidden"); birthdayWishes.classList.remove("show"); }
    if (backBtn) { backBtn.classList.add("hidden"); backBtn.classList.remove("show"); }

    document.body.classList.remove("night-sky");

    // 2. Show the initial popup
    if (popup) {
        // CRITICAL FIX: Remove 'hidden' class to override display:none
        popup.classList.remove("hidden"); 
        
        // Start the animation after a short delay
        setTimeout(() => {
            popup.classList.remove("hide-popup");
            popup.classList.add("show");
        }, 50); // Small delay to allow CSS to process
    }
}

// Attach the new function to the load event
window.addEventListener("load", showInitialPopup);


// Create candles dynamically
function addCandles(numCandles = 3) {
    const candlesContainer = document.querySelector('#cake .candles');
    if (!candlesContainer) return;

    candlesContainer.innerHTML = '';

    const LINE_WIDTH = 120; // Max width for candles on the top layer
    const Y_OFFSET = -35; // Vertical offset to place them correctly

    const spacing = numCandles > 1 ? LINE_WIDTH / (numCandles - 1) : 0;
    const left_edge = -LINE_WIDTH / 2;

    for (let i = 0; i < numCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        const flame = document.createElement('div');
        flame.className = 'flame';
        candle.appendChild(flame);

        let x = 0;
        if (numCandles === 1) {
            x = 0;
        } else {
            x = left_edge + (i * spacing);
        }
        
        candle.style.position = 'absolute';
        candle.style.left = '50%';
        candle.style.top = '50%';
        candle.style.transform = `translate(${x - 4}px, ${Y_OFFSET}px)`; 
        candlesContainer.appendChild(candle);
    }
}

// Balloon creation and launch 
function startBalloons(count = 15) {
    const colors = ['#ff66a3', '#ff8ac6', '#ffcce0', '#f7b74f', '#de5a5a', '#ffd6eb'];
    if (!balloonContainer) return; 
    
    balloonContainer.innerHTML = ''; 

    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        const leftPosition = Math.random() * 100;
        balloon.style.left = `${leftPosition}vw`;

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.backgroundColor = randomColor;

        balloon.style.animationDuration = `${10 + Math.random() * 8}s`; 
        balloon.style.animationDelay = `${Math.random() * 3}s`; 

        balloonContainer.appendChild(balloon);

        setTimeout(() => {
            balloon.remove();
        }, (18000 + 3000));
    }
}


// Go Back Function (Resets the surprise page)
function goBack() {
    // 1. Hide the surprise elements (Re-apply 'hidden' class)
    if (cake) { cake.classList.remove("show"); cake.classList.add("hidden"); }
    if (birthdayText) { birthdayText.classList.remove("show"); birthdayText.classList.add("hidden"); }
    if (birthdayWishes) { birthdayWishes.classList.remove("show"); birthdayWishes.classList.add("hidden"); }
    if (backBtn) { backBtn.classList.remove("show"); backBtn.classList.add("hidden"); }
    
    document.body.classList.remove("night-sky");

    // 2. Clear dynamic elements
    document.querySelectorAll('.star').forEach(star => star.remove());
    document.querySelectorAll('.heart').forEach(heart => heart.remove()); 
    
    // **SAFE CALL:** Check for stopFireworks function
    if (typeof stopFireworks === 'function') { 
        stopFireworks(); 
    }
    
    const candlesContainer = document.querySelector('#cake .candles');
    if (candlesContainer) candlesContainer.innerHTML = ''; 
    if (balloonContainer) balloonContainer.innerHTML = ''; 

    // 3. Show the initial popup
    if (popup) {
      popup.classList.remove("hidden"); // CRITICAL: Must remove hidden before showing
      popup.classList.remove("hide-popup");
      popup.classList.add("show");
    }
}


// --- Surprise Button Listener ---
if (surpriseBtn && popup) {
    surpriseBtn.addEventListener("click", () => {
      // 1. Start popup hide animation
      popup.classList.add("hide-popup");

      // 2. Wait for the popup to finish fading out
      popup.addEventListener("transitionend", function handler() {
        popup.removeEventListener('transitionend', handler);
        
        // Hide the popup once transition is complete
        popup.classList.add("hidden"); 

        // 3. Start surprise animations and effects
        document.body.classList.add("night-sky");
        createStars(150);
        
        addCandles(3); 
        startBalloons(15); 
        
        // Show main surprise elements
        if (cake) cake.classList.remove("hidden"); 
        if (birthdayText) birthdayText.classList.remove("hidden");
        if (birthdayWishes) birthdayWishes.classList.remove("hidden"); 

        if (cake) cake.classList.add("show");
        if (birthdayText) birthdayText.classList.add("show");
        if (birthdayWishes) birthdayWishes.classList.add("show");
        
        if (backBtn) backBtn.classList.add("show");
        
        // **SAFE CALL:** Start fireworks only if the function is loaded
        if (typeof startFireworks === 'function') {
            startFireworks(); 
        }
      }, { once: true });
    });
}
// --- END Surprise Button Listener ---


// Back Button Listener
if (backBtn) {
    backBtn.addEventListener("click", goBack);
}