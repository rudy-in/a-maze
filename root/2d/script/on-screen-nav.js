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
    setTimeout(() => {onscreenNav.style.transition = "transform 0s"}, 690);
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
    if (!elemsColliding(onscreenNav, document.getElementById("controls"), 100)) {
        unfocusControls()
    }
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
    if (!elemsColliding(onscreenNav, document.getElementById("controls"), 100)) {
        unfocusControls()
    }
}

window.addEventListener("contextmenu", (e) => {
    if (e.target.id === "share-url-a") {
        return
    }
    e.preventDefault();
    if (e.target.id === "onscreen-nav-assist") {
        return
    }
    [window.currentX, window.currentY, onscreenNav.style.transform] = window.onScreenNavInitParams;
    initialX = window.currentX;
    initialY = window.currentY;
})

async function adjustOnscreenNav() {
    onscreenNav.style.transition = ""
    const mainBC = main.getBoundingClientRect();
    const onscreenNavBC = onscreenNav.getBoundingClientRect();
    const controlsBC = document.getElementById("controls").getBoundingClientRect();
    const overlaping = () => elemsColliding(onscreenNav, startPos.elem, 15);

    toXY((mainBC.right + screen.width - onscreenNavBC.left - onscreenNavBC.right) / 2, (mainBC.top + mainBC.bottom - onscreenNavBC.top - onscreenNavBC.bottom) / 2);
    await new Promise(r => setTimeout(r, 100));
    if (overlaping()){
        toXY((mainBC.left + mainBC.right - onscreenNavBC.left - onscreenNavBC.right) / 2, (mainBC.bottom + controlsBC.top - onscreenNavBC.top - onscreenNavBC.bottom) / 2);
    }
    await new Promise(r => setTimeout(r, 100));
    if (overlaping()){
        toXY(0, 0);
    }

    document.getElementById("onscreen-nav").classList.add("show-onscreen-nav")
    window.onScreenNavInitParams = [window.currentX, window.currentY, onscreenNav.style.transform]
    setTimeout(() => {onscreenNav.style.transition = "transform 0s"}, 690);
}

var adjustOnscreenNavTimeout;
window.adjustOnscreenNavHandler = () => {
    clearTimeout(adjustOnscreenNavTimeout);
    adjustOnscreenNavTimeout = setTimeout(adjustOnscreenNav, 500);
}
window.addEventListener("orientationchange", adjustOnscreenNavHandler);