window.mazeSquares = {}

class MazeSquare {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "";
        this.used = false;
        this.elem = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.elem.setAttribute('width', 10);
        this.elem.setAttribute('height', 10);
        this.elem.setAttribute('x', x*10-5);
        this.elem.setAttribute('y', y*10-5);
        this.elem.setAttribute('fill', 'black');
        window.mg.appendChild(this.elem);
        window.mazeSquares[`${x},${y}`] = this;
    }
    setColor(color) {
        this.elem.setAttribute('fill', color);
    }
}

const mg = window.mg = document.getElementById('maze-grid');

class Path {
    constructor(start) {
        this.start = start;
        this.path = [start];
    }
    addDot(dot) {
        if (this.path.includes(dot)) {
            throw new DotAlreadyInUseError(`Dot already in use with type ${dot.type}`);
        }
        if (dot.type === "prohibited") {
            return false;
        }
        this.path.push(dot);
        dot.used = true;
        dot.type = "path";
        return true;
    }
    finish() {
        if (this.path.length < 10) {
            throw new PathInvalidError("Path too short");
        }
        if (this.path.length > 256) {
            throw new PathInvalidError("Path too long");
        }
        this.end = this.path[this.path.length-1];
        this.end.type = "end";
    }
    reset() {
        Object.values(window.mazeSquares).forEach(dot => {
            dot.type = "";
        });
        this.path = [this.start];
        this.start.type = "start";
    }
}
function getUnusedNeighbors(dot) {
    const neighbors = {};
    function handler(x, y) {
        let potentialUnusedNeighbor = window.mazeSquares[`${dot.x+x},${dot.y+y}`];
        if (potentialUnusedNeighbor && !potentialUnusedNeighbor.type) {
            neighbors[`${x},${y}`] = (potentialUnusedNeighbor);
        }
    }
    [[1, 0], [-1, 0] ,[0, 1], [0, -1]].forEach(([x, y]) => handler(x, y));
    return neighbors;
}

function constructPath(start, pathLength = 169, condition = (dot) => true){
    start.type = "start";
    const path = new Path(start);
    while (path.path.length < pathLength) {
        try {
            let neighbors = getUnusedNeighbors(path.path[path.path.length-1]);
            if (Object.keys(neighbors).length === 0) {
                path.path[path.path.length-1].type = "prohibited";
                path.path.pop();
            }
            else {
                choosen = pickRandomElement(Object.values(neighbors));
                if (!condition(choosen)) {
                    return path;
                }
                path.addDot(choosen);
                Object.values(neighbors).forEach(dot => {
                    if (dot !== choosen) {
                        dot.type = "prohibited";
                    }
                });
            }
        }
        catch (e) {
            console.warn(e);
            console.log("resetting...");
            path.reset();
        }
    }
    path.finish();
    Object.values(window.mazeSquares).filter(dot => dot.type === "prohibited").forEach(dot => {  // Dots prohibited only for current path
        dot.type = "";
    })
    return path;
}

var c = 0
function preConstruct() {
    for (let x = 1; x < window.gridSize + 1; x++) {
        for (let y = 1; y < window.gridSize + 1; y++) {
            new MazeSquare(x, y);
        }
    }
    for (let x = 1; x < window.gridSize + 1; x++) {
        for (let y = 1; y < window.gridSize + 1; y++) {
            new Line(x, y, x+1, y);
            new Line(x, y, x, y+1);
        }
    }
}
function construct() {
    preConstruct();
    const vals = {
        25: [69, 88, 10, 34, 20],
        49: [169, 175, 50, 169, 25],
        69: [200, 256, 69, 200, 88]
    }
    const val = vals[window.gridSize]
    console.log(val);
    window.mp = constructPath(pickRandomElement(Object.values(window.mazeSquares)), randRange(val[0], val[1])); // Main path
    while (Object.values(window.mazeSquares).filter((d) => !d.used).length > 0 && c < 10000) {
        pathLine(constructPath(pickRandomElement(mp.path), randRange(val[2], val[3]), (dot) => !dot.used).path)
        pathLine(constructPath(pickRandomElement(Object.values(window.mazeSquares).filter((d) => !d.used)), randRange(val[2], val[4]), (dot) => !dot.used).path);
        c++;
    }
    pathLine(mp.path);
    postConstruct();
}
function postConstruct() {
    mp.start.setColor("green");
    mp.end.setColor("red");
    document.getElementById("main").style.display = "block"
    document.getElementById("controls").style.display = "block"
    document.getElementById("loading").style.display = "none"
    document.getElementById("onscreen-nav").classList.add("show-onscreen-nav")
    focusStart()
    startPos = window.mp.start;
    endPos = window.mp.end;
    window.player = new Player(startPos.x, startPos.y, startPos, endPos);
    updateNav()
}