function $(id) {
  return document.getElementById(id);
}

const gameContainer = $("game-container");
const gameText = $("game-text");

const CELL_GRID = [];

function INIT_GAME() {
  let turn = false;
  for (let i = 0; i < 64; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = i;
    if (i % 8 == 0) {
      turn = !turn;
    }
    if (turn) {
      cell.classList.add("light");
    } else {
      cell.classList.add("dark");
    }
    turn = !turn;
    CELL_GRID.push(cell);
  }
}

let Pieces = {
  k: "./assets/black_king.svg",
  n: "./assets/black_knight.svg",
  b: "./assets/black_bishop.svg",
  p: "./assets/black_pawn.svg",
  r: "./assets/black_rook.svg",
  q: "./assets/black_queen.svg",

  K: "./assets/white_king.svg",
  N: "./assets/white_knight.svg",
  B: "./assets/white_bishop.svg",
  P: "./assets/white_pawn.svg",
  R: "./assets/white_rook.svg",
  Q: "./assets/white_queen.svg",
};

class Pawn {
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }
  getAllMoves() {
    // Wherever the piece can move.
    let AllMoves = [];
    if (self.color) {
      // WHITE PAWN. only moves up.
      AllMoves.push({ x: this.position.x - 1, y: this.position.y });
      AllMoves.push({ x: this.position.x - 2, y: this.position.y });
    }
    // Consider special moves. ( En passant )

    return AllMoves;
  }
  getValidMoves() {
    // move should not be considered if check or will put king in check.
    // move might be out of bounds
    // move might be blocked by a piece ( enemy or friendly )
    // move might attack the enemy ( valid )
    console.log(this.getValidMoves());
  }
}
let FEN = "rbnqknbrpppppppp--------------------------------PPPPPPPPRBNQKNBR";
function DRAW_BOARD() {
  gameContainer.innerHTML = ``;
  for (let i = 0; i < 64; i++) {
    if (FEN[i] != "-") {
      CELL_GRID[i].innerHTML = `<img src="${Pieces[FEN[i]]}">`;
    }
    CELL_GRID[i];
    gameContainer.appendChild(CELL_GRID[i]);
  }
}

INIT_GAME();
DRAW_BOARD();
