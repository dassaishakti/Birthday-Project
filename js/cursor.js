// --- cursor-hearts.js ---

let lastHeartTime = 0;
const heartCreationInterval = 50; // Controls how quickly hearts appear (50ms)

/**
 * Creates and places a heart element at the given coordinates.
 */
function createHeart(x, y) {
    const currentTime = Date.now();
    
    // Throttle the heart creation to prevent performance issues
    if (currentTime - lastHeartTime < heartCreationInterval) {
        return;
    }
    lastHeartTime = currentTime;

    const heart = document.createElement('div');
    heart.classList.add('heart');

    // Position the heart centered on the cursor/touch point
    // Subtract half the heart size (7.5px)
    heart.style.left = `${x - 7.5}px`;
    heart.style.top = `${y - 7.5}px`;

    document.body.appendChild(heart);

    // Remove the heart after the animation finishes (1.5 seconds)
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// 1. Mouse Event Listener (for laptops)
document.addEventListener('mousemove', (event) => {
    createHeart(event.clientX, event.clientY);
});

// 2. Touch Event Listener (for mobile/tablet)
document.addEventListener('touchmove', (event) => {
    // Prevent default scrolling to ensure touch events are captured
    event.preventDefault(); 
    
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        createHeart(touch.clientX, touch.clientY);
    }
}, { passive: false });