import { Board } from './board';
import './style.css'
import { one_to_2d } from './vec2';


const root = document.getElementById('root')!;

const container = document.createElement('div');
container.id = 'container'


const board = new Board(container);

for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    let pos = one_to_2d(i)!;
    cell.classList.add('cell');
    if ((pos.x + pos.y) % 2 == 0) {
        cell.classList.add('cell-light')
    }
    else {
        cell.classList.add('cell-dark')
    }
    const image = document.createElement('img');
    image.style.width = '100%'
    image.style.height = '100%'
    cell.appendChild(image)
    container.appendChild(cell);
    cell.addEventListener('click', (e) => {
        board.handleClick(pos);
    })

}
board.display()

root.appendChild(container)



