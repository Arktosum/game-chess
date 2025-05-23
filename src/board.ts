import FenParser from "./fen";
import { addVec2, one_to_2d, vec2 } from "./vec2";


enum PieceType {
    EMPTY = 0b000,
    PAWN = 0b001,
    ROOK = 0b010,
    KNIGHT = 0b011,
    BISHOP = 0b100,
    QUEEN = 0b101,
    KING = 0b110,
}
enum PieceColor {
    BLACK = 0b0000,
    WHITE = 0b1000
}

const symbolToPiece = {
    '.': PieceType.EMPTY,
    'r': PieceColor.BLACK | PieceType.ROOK,
    'n': PieceColor.BLACK | PieceType.KNIGHT,
    'b': PieceColor.BLACK | PieceType.BISHOP,
    'q': PieceColor.BLACK | PieceType.QUEEN,
    'k': PieceColor.BLACK | PieceType.KING,
    'p': PieceColor.BLACK | PieceType.PAWN,


    'R': PieceColor.WHITE | PieceType.ROOK,
    'N': PieceColor.WHITE | PieceType.KNIGHT,
    'B': PieceColor.WHITE | PieceType.BISHOP,
    'Q': PieceColor.WHITE | PieceType.QUEEN,
    'K': PieceColor.WHITE | PieceType.KING,
    'P': PieceColor.WHITE | PieceType.PAWN,
}

const PieceToImage = {
    [PieceType.EMPTY]: './assets/transparent.svg',
    [PieceColor.BLACK | PieceType.ROOK]: './assets/black_rook.svg',
    [PieceColor.BLACK | PieceType.KNIGHT]: './assets/black_knight.svg',
    [PieceColor.BLACK | PieceType.BISHOP]: './assets/black_bishop.svg',
    [PieceColor.BLACK | PieceType.QUEEN]: './assets/black_queen.svg',
    [PieceColor.BLACK | PieceType.KING]: './assets/black_king.svg',
    [PieceColor.BLACK | PieceType.PAWN]: './assets/black_pawn.svg',

    [PieceColor.WHITE | PieceType.ROOK]: './assets/white_rook.svg',
    [PieceColor.WHITE | PieceType.KNIGHT]: './assets/white_knight.svg',
    [PieceColor.WHITE | PieceType.BISHOP]: './assets/white_bishop.svg',
    [PieceColor.WHITE | PieceType.QUEEN]: './assets/white_queen.svg',
    [PieceColor.WHITE | PieceType.KING]: './assets/white_king.svg',
    [PieceColor.WHITE | PieceType.PAWN]: './assets/white_pawn.svg',
}

enum Poke {
    EMPTY_CELL,
    ALLY_CELL,
    ENEMY_CELL
}
export class Board {
    board: PieceType[][]
    container: HTMLDivElement;
    movementMoves: Set<number>;
    attackMoves: Set<number>;
    selectedPiece: number | null;
    turn: PieceColor;
    constructor(container: HTMLDivElement) {
        const fen = new FenParser();
        this.board = fen.getPlacementData().map((row) => row.map(item => symbolToPiece[item]));
        this.container = container;
        this.movementMoves = new Set();
        this.attackMoves = new Set();
        this.selectedPiece = null;
        this.turn = PieceColor.WHITE;
    }
    getPiece(position: vec2) {
        return this.board[position.x][position.y]
    }
    extractPieceType(piece: PieceType) {
        return piece & 0b0111
    }
    extractColor(piece: PieceType) {
        return piece & 0b1000
    }
    getAllPieces(pieceColor: PieceColor) {
        let pieces: [PieceType, vec2][] = []
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let this_piece = this.getPiece({ x: i, y: j })
                let this_piece_color = this.extractColor(this_piece);
                if (this_piece_color == pieceColor) {
                    pieces.push([this_piece, { x: i, y: j }])
                }
            }
        }
        return pieces;
    }
    handleClick(position: vec2) {
        if (this.selectedPiece) {
            // Maybe makin a move!
            let from_position = one_to_2d(this.selectedPiece)!;
            let from_piece = this.getPiece(from_position);

            if (this.movementMoves.has(position.position!) || (this.attackMoves.has(position.position!))) {
                this.board[position.x][position.y] = from_piece;
                this.board[from_position.x][from_position.y] = PieceType.EMPTY;

                this.selectedPiece = null;
                this.movementMoves = new Set();
                this.attackMoves = new Set();
                this.turn = this.turn == PieceColor.BLACK ? PieceColor.WHITE : PieceColor.BLACK
                this.display();
                if (this.isChecked(from_piece, position)) {
                    alert("Check!");
                }
                return;
            }
        }
        this.movementMoves = new Set();
        this.attackMoves = new Set();
        this.selectedPiece = position.position!;
        const piece = this.getPiece(position);
        const pieceColor = this.extractColor(piece);
        if (pieceColor != this.turn) return;
        const pieceType = this.extractPieceType(piece);
        const [movementMoves, attackMoves] = this.generateMoves(pieceType, pieceColor, position);
        for (let move of movementMoves) {
            this.movementMoves.add(move.position!);
        }
        for (let move of attackMoves) {
            this.attackMoves.add(move.position!)
        }
        this.display()
    }
    isChecked(piece: PieceType, position: vec2): boolean {
        const pieceColor = this.extractColor(piece);
        const pieceType = this.extractPieceType(piece);
        let [moves, attacks] = this.generateMoves(pieceType, pieceColor, position);

        for (let attack of attacks) {
            let otherPiece = this.getPiece(attack);
            const otherPieceType = this.extractPieceType(otherPiece);
            const otherPieceColor = this.extractColor(otherPiece);
            if (otherPieceType == PieceType.KING && pieceColor != otherPieceColor) {
                return true;
            }
        }
        return false;
    }
    canAttack(pieceColor: PieceColor, attack_position: vec2): boolean {
        let pieces = this.getAllPieces(pieceColor);

        let oppositeColor = pieceColor == PieceColor.BLACK ? PieceColor.WHITE : PieceColor.BLACK;
        let actualTargetPiece = this.getPiece(attack_position);

        let temporaryPiece = oppositeColor | PieceType.PAWN;
        this.board[attack_position.x][attack_position.y] = temporaryPiece;

        let can_attack = false;
        for (let [piece, piece_position] of pieces) {
            const [moves, attacks] = this.generateMoves(piece, pieceColor, piece_position);
            for (let attack of attacks) {
                if (attack.x == attack_position.x && attack.y == attack_position.y) {
                    can_attack = true;
                    break;
                }
            }
            if (can_attack) break;
        }
        this.board[attack_position.x][attack_position.y] = actualTargetPiece;
        return can_attack;
    }
    generateMoves(pieceType: PieceType, pieceColor: PieceColor, position: vec2): [vec2[], vec2[]] {
        switch (pieceType) {
            case PieceType.PAWN: return this.generatePawnMoves(pieceColor, position);
            case PieceType.ROOK: return this.generateRookMoves(pieceColor, position);
            case PieceType.BISHOP: return this.generateBishopMoves(pieceColor, position);
            case PieceType.KNIGHT: return this.generateKnightMoves(pieceColor, position);
            case PieceType.QUEEN: return this.generateQueenMoves(pieceColor, position);
            case PieceType.KING: return this.generateKingMoves(pieceColor, position);
            default: return [[], []];
        }
    }

    generatePawnMoves(pieceColor: PieceColor, position: vec2): [vec2[], vec2[]] {
        let movementMoves = [];
        let attackMoves = [];

        const forwardDirection = pieceColor == PieceColor.BLACK ? { x: 1, y: 0 } : { x: -1, y: 0 }
        const leftAttackDirection = pieceColor == PieceColor.BLACK ? { x: 1, y: 1 } : { x: -1, y: 1 }
        const rightAttackDirection = pieceColor == PieceColor.BLACK ? { x: 1, y: -1 } : { x: -1, y: -1 }
        const startingRow = pieceColor == PieceColor.BLACK ? 1 : 6

        let left_attack_position = addVec2(position, leftAttackDirection);
        if (left_attack_position && this.poke(pieceColor, left_attack_position) == Poke.ENEMY_CELL) {
            attackMoves.push(left_attack_position);
        }
        let right_attack_position = addVec2(position, rightAttackDirection);
        if (right_attack_position && this.poke(pieceColor, right_attack_position) == Poke.ENEMY_CELL) {
            attackMoves.push(right_attack_position);
        }

        if (position.x == startingRow) {
            // Can move twice!
            let new_position = addVec2(position, forwardDirection);
            if (new_position && this.poke(pieceColor, new_position) == Poke.EMPTY_CELL) {
                movementMoves.push(new_position);
                new_position = addVec2(new_position, forwardDirection);
                if (new_position && this.poke(pieceColor, new_position) == Poke.EMPTY_CELL) {
                    movementMoves.push(new_position);
                }
            }
        }

        else {
            // Can move one
            let new_position = addVec2(position, forwardDirection);
            if (new_position && this.poke(pieceColor, new_position) == Poke.EMPTY_CELL) {
                movementMoves.push(new_position);
            }
        }

        return [movementMoves, attackMoves]

    }
    generateRookMoves(pieceColor: PieceColor, position: vec2): [vec2[], vec2[]] {
        let movementMoves: vec2[] = [];
        let attackMoves: vec2[] = [];

        let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for (let dir of directions) {
            let [moves, attacks] = this.generateSlidingMoves(pieceColor, position, { x: dir[0], y: dir[1] });
            movementMoves = [...movementMoves, ...moves]
            attackMoves = [...attackMoves, ...attacks]
        }
        return [movementMoves, attackMoves]
    }
    poke(color: PieceColor, otherPosition: vec2) {
        let piece = this.getPiece(otherPosition);
        let piece_color = this.extractColor(piece);
        if (piece == PieceType.EMPTY) return Poke.EMPTY_CELL;

        return color == piece_color ? Poke.ALLY_CELL : Poke.ENEMY_CELL
    }
    generateSlidingMoves(pieceColor: PieceColor, position: vec2, direction: vec2): [vec2[], vec2[]] {
        let movementMoves: vec2[] = [];
        let attackMoves: vec2[] = [];

        let new_position = addVec2(position, direction);
        while (new_position) {

            let poke = this.poke(pieceColor, new_position);
            if (poke == Poke.ALLY_CELL) break;
            else if (poke == Poke.ENEMY_CELL) { attackMoves.push(new_position); break; }
            else {
                movementMoves.push(new_position)
                new_position = addVec2(new_position, direction);
            }
        }
        return [movementMoves, attackMoves]
    }
    generateBishopMoves(pieceColor: PieceColor, position: vec2): [vec2[], vec2[]] {
        let movementMoves: vec2[] = [];
        let attackMoves: vec2[] = [];

        let directions = [[1, 1], [-1, 1], [1, -1], [-1, -1]];

        for (let dir of directions) {
            let [moves, attacks] = this.generateSlidingMoves(pieceColor, position, { x: dir[0], y: dir[1] });
            movementMoves = [...movementMoves, ...moves]
            attackMoves = [...attackMoves, ...attacks]
        }
        return [movementMoves, attackMoves]
    }
    generateKnightMoves(pieceColor: PieceColor, position: vec2): [vec2[], vec2[]] {
        let movementMoves: vec2[] = [];
        let attackMoves: vec2[] = [];

        let directions = [
            [-2, -1], [-2, +1],
            [-1, -2], [-1, +2],
            [+1, -2], [+1, +2],
            [+2, -1], [+2, +1]
        ];

        for (let dir of directions) {
            let direction = { x: dir[0], y: dir[1] }
            let new_position = addVec2(position, direction);
            if (!new_position) continue;
            let poke = this.poke(pieceColor, new_position);
            if (poke == Poke.EMPTY_CELL) movementMoves.push(new_position);
            if (poke == Poke.ENEMY_CELL) attackMoves.push(new_position);
        }
        return [movementMoves, attackMoves]
    }

    generateQueenMoves(pieceColor: PieceColor, position: vec2): [vec2[], vec2[]] {
        let movementMoves: vec2[] = [];
        let attackMoves: vec2[] = [];

        let directions = [[1, 1], [-1, 1], [1, -1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];

        for (let dir of directions) {
            let [moves, attacks] = this.generateSlidingMoves(pieceColor, position, { x: dir[0], y: dir[1] });
            movementMoves = [...movementMoves, ...moves]
            attackMoves = [...attackMoves, ...attacks]
        }
        return [movementMoves, attackMoves]
    }

    generateKingMoves(pieceColor: PieceColor, position: vec2): [vec2[], vec2[]] {
        let movementMoves: vec2[] = [];
        let attackMoves: vec2[] = [];

        let directions = [[1, 1], [-1, 1], [1, -1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]];

        let oppositeColor = pieceColor == PieceColor.BLACK ? PieceColor.WHITE : PieceColor.BLACK;
        for (let dir of directions) {
            let direction = { x: dir[0], y: dir[1] }
            let new_position = addVec2(position, direction);
            if (!new_position) continue;
            this.board[position.x][position.y] = PieceType.EMPTY;
            let can_attack = this.canAttack(oppositeColor, new_position);
            this.board[position.x][position.y] = pieceColor | PieceType.KING
            if (can_attack) continue;

            let poke = this.poke(pieceColor, new_position);
            if (poke == Poke.EMPTY_CELL) {
                movementMoves.push(new_position)
            }
            if (poke == Poke.ENEMY_CELL) {
                attackMoves.push(new_position);

            }
        }
        return [movementMoves, attackMoves]
    }

    display() {
        for (let i = 0; i < 64; i++) {
            const cell = this.container.children[i];
            let pos = one_to_2d(i)!;
            cell.classList.add('cell');
            cell.classList.remove('cell-selected')
            cell.classList.remove('cell-move')
            cell.classList.remove('cell-attack')
            if ((pos.x + pos.y) % 2 == 0) {
                cell.classList.add('cell-light')
            }
            else {
                cell.classList.add('cell-dark')
            }
            if (this.selectedPiece == i) {
                cell.classList.add('cell-selected')
            }
            if (this.movementMoves.has(i)) {
                cell.classList.add('cell-move')
            }
            if (this.attackMoves.has(i)) {
                cell.classList.add('cell-attack')
            }
            const img = cell.children[0] as HTMLImageElement;
            img.src = PieceToImage[this.getPiece(pos)]
        }
    }
}