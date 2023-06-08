const cells = document.getElementsByClassName('cell');

function CELLS(x,y){
    return cells[8*x+y];
}
let a

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
let start = true
for(let i = 0 ; i < 8;i++){

    for(let j = 0 ; j < 8;j++){
    
        CELLS(i,j).classList.add(start? 'light' : 'dark');
        start = !start
    }
    start = !start
}
function Point(x,y){
    return {x,y}
}
class Pawn{
    constructor(type,position){
        this.color = type == 'P'
        this.position = position
        this.img = piece_image[type]
        this.isFirstMove = true;
    }
    validMoves(){
        let {x,y} = this.position
        let validMoves = []
        let offset = -1*(this.color ? 1 : -1);

        if(InBounds(x+offset,y) && isUnOccupied(x+offset,y)){
            validMoves.push(Point(x+offset,y));
            // Can only move to second if first is possible
            if(this.isFirstMove && InBounds(x+offset*2,y) && isUnOccupied(x+offset*2,y)) validMoves.push(Point(x+offset*2,y));
        }
        return validMoves;

    }
    attackMoves(){

    }
}
class Rook{
    constructor(type,position){
        this.color = type == 'R'
        this.position = position
        this.img = piece_image[type]
    }
}

class Knight {
    constructor(type,position){
        this.color = type == 'N'
        this.position = position
        this.img = piece_image[type]
    }
    validMoves(){
        let {x,y} = this.position
        let validMoves = []

        let candidates = [
            [x+2,y-1],[x-2,y-1],[x+2,y+1],[x-2,y+1],
            [x-1,y-2],[x-1,y+2],[x+1,y-2],[x+1,y+2],
        ]
        for(let candidate of candidates){
            let [X,Y] = candidate
            if(InBounds(X,Y) && isUnOccupied(X,Y)){
                validMoves.push(Point(X,Y));
            }
        }
       
        return validMoves;

    }
}

class Bishop{
    constructor(type,position){
        this.color = type == 'B'
        this.position = position
        this.img = piece_image[type]
    }
}
class Queen {
    constructor(type,position){
        this.color = type == 'Q'
        this.position = position
        this.img = piece_image[type]
    }
}

class King {
    constructor(type,position){
        this.color = type == 'K'
        this.position = position
        this.img = piece_image[type]
    }
}

let GRID = []
let FEN = '8/8/8/8/4n3/8/8/8'







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

initializeGrid(FEN);


function renderGrid(){
    GRID.forEach((rank,i)=>{
        rank.forEach((file,j)=>{
            if(GRID[i][j] == '-') return;
            CELLS(i,j).innerHTML = `<img src="${GRID[i][j].img}" width="100px">`

            CELLS(i,j).addEventListener('click',(e)=>{
                let piece = GRID[i][j]
                console.log(i,j,GRID[i][j].position)
                CELLS(i,j).classList.add('selected');
                console.log(piece.validMoves())
                for(let move of piece.validMoves()){
                    let {x,y} = move;
                    CELLS(x,y).classList.add('valid');
                };
            })
        })
    })
}

renderGrid()


function InBounds(x,y){
    return (x>=0 && y>=0 && x < 8 && y < 8);
}
function isUnOccupied(x,y){
    return GRID[x][y] == '-';
}
// function isEnemy(x,y,color){
//     return GRID[x][y] == GRID[x][y].toUpperCase() ? color
// }



