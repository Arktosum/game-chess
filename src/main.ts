import Board from './Board'
import './style.css'
// DOM - Document Object Model
// Document - HTML file
// Object - HashMap

const root = document.getElementById('root')!

const container = document.createElement('div')
container.id = 'container'
root.appendChild(container)


// Rook 'r' : 'R'
// Knight 'n' : 'N'
// King  'k' : 'K"
// Queen  'q' : 'Q'
// Bishop 'b' : 'B'
// Pawn 'p' : 'P'

// Black and White


const board = new Board(container);

board.display();


