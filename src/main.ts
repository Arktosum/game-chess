import Engine from './engine';
import './style.css'
const root = document.getElementById('root')!


function oneToTwoD(i: number) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return [row, col];
}
const container = document.createElement('div');

const engine = new Engine();
container.id = 'container'


let valid_moves: number[] = []
let attack_moves: number[] = []
let selected_cell: number | null = null;

for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell'

    let [row, col] = oneToTwoD(i);
    if ((row + col) % 2 == 0) {
        cell.classList.add('cell-light')
    }
    else {
        cell.classList.add('cell-dark')
    }
    const image = document.createElement('img');

    image.style.width = '100%';
    image.style.height = '100%';

    cell.addEventListener('click', () => {
        if (selected_cell == null) {
            const moves = engine.getMoves(i);
            if (moves == null) {
                selected_cell = null;
                valid_moves = [];
                attack_moves = [];
                return;
            }; // Maybe empty cell

            selected_cell = i;
            valid_moves = moves.validMoves;
            attack_moves = moves.attackMoves;
        }
        else {
            // Moving if clicked cell is in valid moves or attack movse
            if (valid_moves.includes(i) || attack_moves.includes(i)) {
                engine.makeMove(selected_cell, i);
                valid_moves = [];
                attack_moves = [];
            }
            else {
                const moves = engine.getMoves(i);
                if (moves == null) {
                    selected_cell = null;
                    valid_moves = [];
                    attack_moves = [];
                    return;
                }; // Maybe empty cell

                selected_cell = i;
                valid_moves = moves.validMoves;
                attack_moves = moves.attackMoves;
            }
        }


    })
    cell.appendChild(image);
    container.appendChild(cell);
}
root.appendChild(container);


function update_board() {
    for (let i = 0; i < 64; i++) {
        let cell = container.children[i];
        cell.classList.remove('cell-move');
        cell.classList.remove('cell-attack');
        cell.classList.remove('cell-selected');
        if (valid_moves.includes(i)) {
            cell.classList.add('cell-move');
        }
        if (attack_moves.includes(i)) {
            cell.classList.add('cell-attack');
        }
        if (i == selected_cell) {
            cell.classList.add('cell-selected')
        }
        const image = cell.children[0] as HTMLImageElement;
        image.src = engine.getImage(engine.board[i]);
    }
    requestAnimationFrame(update_board);
}

requestAnimationFrame(update_board);





