import Pawn from './pieces/Pawn.js';
import Knight from './pieces/Knight.js';
import Rook from './pieces/Rook.js';
import King from './pieces/King.js';
import Queen from './pieces/Queen.js';
import Bishop from './pieces/Bishop.js';


const cells = document.getElementsByClassName('cell');
const gameText = document.getElementById('game-text');
const placeAudio = new Audio('./chess_move.mp3');


function CELLS(x,y){
    return cells[8*x+y];
}

const piece_image = {
    'K': './assets/white_king.svg',
    'Q': './assets/white_queen.svg',
    'R': './assets/white_rook.svg',
    'B': './assets/white_bishop.svg',
    'N': './assets/white_knight.svg',
    'P': './assets/white_pawn.svg',

    'k' :'./assets/black_king.svg',
    'q': './assets/black_queen.svg',
    'r': './assets/black_rook.svg',
    'b': './assets/black_bishop.svg',
    'n': './assets/black_knight.svg',
    'p': './assets/black_pawn.svg',
}

{/* 
<FEN> ::=  
    <Piece Placement>
    ' ' <Side to move>
    ' ' <Castling ability>
    ' ' <En passant target square>
    ' ' <Halfmove clock>
    ' ' <Fullmove counter></Fullmove> 
    
*/}
// Rook : r
// King : k
// Pawn : p
// Knight : n
// Queen : q
// Bishop : b

// White : UPPERCASE
// Black : lowercase
// A Column is a rank!

// From rank 8 to rank 1

// True is Light
// False is Dark

export function Point(x,y){
    return {x,y}
}

export function InBounds(x,y){
    return (x>=0 && y>=0 && x < 8 && y < 8);
}
export function isUnOccupied(x,y){
    return GRID[x][y] == '-';
}

export function isEnemy(x,y,color){
    return (GRID[x][y].type == GRID[x][y].type.toUpperCase() ) != color
}


function initializeGrid(FENString){
    let rank = 0; // i 
    let file = 0; // j
    let RANK = []
    for(let i = 0 ; i < FENString.length;i++){
        let letter = FENString[i];
        if(letter == '/'){
            GRID.push(RANK);
            RANK = [];
            rank++;
            file=0;
            continue;
        }
        if(!isNaN(letter)){
            let count = parseInt(letter, 10);
            for(let i = 0; i < count; i++){
                RANK.push('-');
                file++;
            }
            continue;
        }
        if(letter.toLowerCase() == 'k') RANK.push(new King(letter,{x:rank,y:file}));
        if(letter.toLowerCase() == 'q') RANK.push(new Queen(letter,{x:rank,y:file}));
        if(letter.toLowerCase() == 'r') RANK.push(new Rook(letter,{x:rank,y:file}));
        if(letter.toLowerCase() == 'b') RANK.push(new Bishop(letter,{x:rank,y:file}));
        if(letter.toLowerCase() == 'n') RANK.push(new Knight(letter,{x:rank,y:file}));
        if(letter.toLowerCase() == 'p') RANK.push(new Pawn(letter,{x:rank,y:file}));
        file++;
    }
    GRID.push(RANK);
}


function renderGrid(){
    let start = true
    for(let i = 0 ; i < 8;i++){
        for(let j = 0 ; j < 8;j++){
            let cell = CELLS(i,j)
            const clonedElement = cell.cloneNode(true);
            cell.parentNode.replaceChild(clonedElement, cell);
            cell = clonedElement;
            cell.innerHTML = ``
            cell.classList.remove('selected','valid','attack');
            cell.classList.add(start? 'light' : 'dark');
            start = !start
            
            cell.addEventListener('click',(e)=>{
                GAME(e,i,j);
            })
            if(GRID[i][j] == '-') continue;
            cell.innerHTML = `<img src="${piece_image[GRID[i][j].type]}" width="100px">`
        }
        start = !start
    }
}

// ------------------------------------------------------------------------------------


let GRID = []
let FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
let check = false;
let turn = true // White to move
gameText.innerText = `${turn? 'White' : 'Black'} to Move!`;
initializeGrid(FEN);
renderGrid()
let selectedPiece = null;

function GAME(e,i,j){
    let piece = GRID[i][j]

    if(selectedPiece == null) {
        if(piece.color != turn) return;
        selectPiece(i,j);
    }
    else{
        let moves = selectedPiece.validMoves()
        let isCapture = false; // movement
        let isLegal = false;
        for(let move of moves.attackMoves){
            let {x,y} = move;
            if (x == i && y == j){ 
                isLegal = true;
                isCapture = true; // attack
                break}
        }
        for(let move of moves.validMoves){
            let {x,y} = move;
            if (x == i && y == j){ isLegal = true; break}
        }
        
        if(!isLegal){
            selectedPiece = null;
            renderGrid();
            GAME(e,i,j);
            return;
        };
        if(selectedPiece.type.toLowerCase() == 'p'){
            selectedPiece.isFirstMove = false;
        }
       
        GRID[i][j] = selectedPiece;
        GRID[selectedPiece.position.x][selectedPiece.position.y] = '-';
        GRID[i][j].position = {x:i,y:j};
        selectedPiece = null;

        if(isCapture) {
            console.log(`${GRID[i][j].type}x${String.fromCharCode(97+j)}${i}`)
        }
        else{
            console.log(`${GRID[i][j].type}${String.fromCharCode(97+j)}${i}`)
            // When a piece is moved ( Not captured ) check for a check.
            for(let move of GRID[i][j].validMoves().attackMoves){
                let {x,y} = move
                if(GRID[x][y].type.toLowerCase()  == 'k'){
                    check = true;
                }
            }
        }

        turn = !turn
        gameText.innerText = `${turn? 'White' : 'Black'} to Move!`;
        placeAudio.play();
        renderGrid()
    }
}

function selectPiece(i,j){
    let piece = GRID[i][j]
    if(piece =='-') return;
    renderGrid();
    selectedPiece = piece;
    CELLS(i,j).classList.add('selected');
    for(let move of piece.validMoves().validMoves){
        let {x,y} = move;
        CELLS(x,y).classList.add('valid');
    };
    for(let move of piece.validMoves().attackMoves){
        let {x,y} = move;
        CELLS(x,y).classList.add('attack');
    };
}


// ------------------------------------------------------------------------------------
