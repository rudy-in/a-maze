function revealAnswer() {
    Object.values(window.mazeSquares).forEach((dot) => {
        dot.setColor("black");
    })
    mp.path.forEach((dot) => {
        dot.setColor("rgba(0, 255, 0, .25)");
    });
    mp.start.setColor("green");
    mp.end.setColor("red");
}
setTimeout(construct, 100)
window.addEventListener("touchstart", () => {
    document.body.requestFullscreen();
})
window.addEventListener("click", () => {
    document.body.requestFullscreen();
})