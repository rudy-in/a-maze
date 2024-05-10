// The code in this file is partially generated by GitHub Copilot

// Get the #onscreen-nav element
const onscreenNav = document.querySelector('#onscreen-nav');
// Initialize variables for tracking touch positions
let initialX = 0;
let initialY = 0;
window.currentX = 0;
window.currentY = 0;

function toXY(x, y) {
    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }
    if (x > window.innerWidth - onscreenNav.offsetWidth) {
        x = window.innerWidth - onscreenNav.offsetWidth;
    }
    if (y > window.innerHeight - onscreenNav.offsetHeight) {
        y = window.innerHeight - onscreenNav.offsetHeight;
    }
    onscreenNav.style.transform = `translate(${x}px, ${y}px)`;
    window.currentX = x;
    window.currentY = y;
}

// Function to handle touch start event
function handleTouchStart(event) {
    if (event.target.id === "onscreen-nav-assist") {
        return
    }
    initialX = event.touches[0].clientX - currentX;
    initialY = event.touches[0].clientY - currentY;
}

// Function to handle touch move event
function handleTouchMove(event) {
    event.preventDefault();
    toXY(event.touches[0].clientX - initialX, event.touches[0].clientY - initialY);
    unfocusControls()
}

// Add event listeners for touch events
onscreenNav.addEventListener('touchstart', handleTouchStart, false);
onscreenNav.addEventListener('touchmove', handleTouchMove, false);

// Add event listeners for mouse events
onscreenNav.addEventListener('mousedown', (e) => {
    if (e.target.id === "onscreen-nav-assist") {
        return
    }
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', handleMouseMove);
    });
    window.addEventListener('blur', () => {
        window.removeEventListener('mousemove', handleMouseMove);
    });
    window.addEventListener('click', () => {
        window.removeEventListener('mousemove', handleMouseMove);
    });
});
function handleMouseMove(e) {
    toXY(e.clientX - initialX, e.clientY - initialY);
    unfocusControls()
}

window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (e.target.id === "onscreen-nav-assist") {
        return
    }
    onscreenNav.style.transform = "";
    initialX = 0;
    initialY = 0;
    window.currentX = 0;
    window.currentY = 0;
})

function adjustOnscreenNav() {
    const mainBC = main.getBoundingClientRect();
    const onscreenNavBC = onscreenNav.getBoundingClientRect();
    const controlsBC = document.getElementById("controls").getBoundingClientRect();
    if(screen.height > screen.width){ // Portrait
        toXY((mainBC.left + mainBC.right - onscreenNavBC.left - onscreenNavBC.right) / 2, (mainBC.bottom + controlsBC.top - onscreenNavBC.top - onscreenNavBC.bottom) / 2);
    }
    else { // Landscape
        toXY((mainBC.right + screen.width - onscreenNavBC.left - onscreenNavBC.right) / 2, (mainBC.top + mainBC.bottom - onscreenNavBC.top - onscreenNavBC.bottom) / 2);
    }
    var attempts = 0;
    while (attempts < 100 && (elemsColliding(onscreenNav, startPos.elem, 15) || elemsColliding(onscreenNav, document.getElementById("controls")))) {
        toXY(randRange(0, mainBC.width), randRange(0, mainBC.height));
        attempts++;
    }
}

var adjustOnscreenNavTimeout;
window.addEventListener("resize", () => {
    clearTimeout(adjustOnscreenNavTimeout);
    adjustOnscreenNavTimeout = setTimeout(adjustOnscreenNav, 500);
});