
import './style.css'
const root = document.querySelector('#root');

const container = document.createElement('div')

container.id = 'container';

interface vec2 {
    x: number,
    y: number
}
function one_to_vec2(i) {
    return { x: Math.floor(i / 8), y: i % 8 } as vec2;
}


for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    let pos = one_to_vec2(i);
    if ((pos.x + pos.y) % 2 == 0) {
        cell.classList.add('cell-light');
    }
    else {
        cell.classList.add('cell-dark');
    }
    container.appendChild(cell);
}

root?.appendChild(container)
function render() {
    for (let i = 0; i < 64; i++) {
        let cell = container.children[i];
    }
}


let prevTime = Date.now();
let FRAMES_PER_SECOND = 1

function animate() {
    let currentTime = Date.now();
    if (currentTime - prevTime >= 1000 / FRAMES_PER_SECOND) {
        render();
        prevTime = currentTime;
    }
    requestAnimationFrame(animate)
}


requestAnimationFrame(animate)