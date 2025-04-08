import FEN from './fen';
import './style.css'
const root = document.getElementById('root')!


function oneToTwoD(i: number) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return [row, col];
}
const container = document.createElement('div');



const PIECE_TO_IMAGE = {
    'p': './assets/black_pawn.svg',
    'b': './assets/black_bishop.svg',
    'k': './assets/black_king.svg',
    'q': './assets/black_queen.svg',
    'n': './assets/black_knight.svg',
    'r': './assets/black_rook.svg',

    'P': './assets/white_pawn.svg',
    'B': './assets/white_bishop.svg',
    'K': './assets/white_king.svg',
    'Q': './assets/white_queen.svg',
    'N': './assets/white_knight.svg',
    'R': './assets/white_rook.svg',

    '.': './assets/transparent.svg'

}



enum PieceType {
    PAWN,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING,
    ROOK
}

enum PieceColor {
    BLACK,
    WHITE
}

const initial_position = FEN.parse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

container.id = 'container'
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
    image.src = PIECE_TO_IMAGE[initial_position[i]];

    cell.appendChild(image);

    container.appendChild(cell);
}

root.appendChild(container);

