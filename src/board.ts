import FENParser from "./fenParser";
import MoveManager from "./moveManager";
import Piece from "./piece";

const moveSound = new Audio("./chess_move.mp3");


export default class Board {
    board: string[]
    move_manager: MoveManager
    cells: HTMLDivElement[]
    container: HTMLDivElement;
    selected_piece: number | null;
    valid_positions: Set<number>;
    valid_piece: boolean;
    TURN: boolean;
    constructor(container: HTMLDivElement) {
        const fen = new FENParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        this.board = fen.getBoard();
        this.move_manager = new MoveManager(this.board);
        this.cells = [];
        this.container = container;
        this.selected_piece = null;
        this.valid_positions = new Set();
        this.TURN = true;// White's move.
    }
    display() {
        this.container.innerHTML = ``;
        this.cells = [];
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.classList.add(this.getColor(i) ? 'cell-light' : 'cell-dark');

            cell.textContent = ``
            if (this.board[i] != '.') {
                const image = document.createElement('img');
                image.src = Piece.getImage(this.board[i]);
                image.width = 70;
                image.height = 70;
                cell.appendChild(image);
            }
            cell.addEventListener('click', () => {
                this.pieceClicked(i);
            });
            this.cells.push(cell);
            this.container.appendChild(cell);
        }
    }
    getColor(i: number): boolean {
        const r = Math.floor(i / 8);
        const c = i % 8;
        return (r + c) % 2 == 0;
    };
    pieceClicked(i: number) {
        const symbol = this.board[i];
        const color = symbol == symbol.toUpperCase();
        if (this.selected_piece != null) {
            if (this.valid_positions.has(i)) {
                // Player wants to move!
                this.board[i] = this.board[this.selected_piece];
                this.board[this.selected_piece] = '.';
                this.selected_piece = null;
                moveSound.play();
                this.display();
                return;
            }
        }
        if (this.board[i] == '.') return;
        this.selected_piece = i;
        const [movePositions, attackPositions] = this.move_manager.getMove(symbol, i);

        this.valid_positions = new Set([...movePositions, ...attackPositions]);
        // Reset cell board.
        this.display();
        this.cells[this.selected_piece].classList.add('cell-selected');
        for (let pos of movePositions) {
            this.cells[pos].classList.add('cell-move');
        }
        for (let pos of attackPositions) {
            this.cells[pos].classList.add('cell-attack');
        }
    }

}