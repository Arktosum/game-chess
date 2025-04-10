import FEN from "./fen";



enum Piece {
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
    WHITE = 0b1000,
}

const PIECE_TO_IMAGE = {
    [PieceColor.BLACK | Piece.PAWN]: './assets/black_pawn.svg',
    [PieceColor.BLACK | Piece.BISHOP]: './assets/black_bishop.svg',
    [PieceColor.BLACK | Piece.KING]: './assets/black_king.svg',
    [PieceColor.BLACK | Piece.QUEEN]: './assets/black_queen.svg',
    [PieceColor.BLACK | Piece.KNIGHT]: './assets/black_knight.svg',
    [PieceColor.BLACK | Piece.ROOK]: './assets/black_rook.svg',

    [PieceColor.WHITE | Piece.PAWN]: './assets/white_pawn.svg',
    [PieceColor.WHITE | Piece.BISHOP]: './assets/white_bishop.svg',
    [PieceColor.WHITE | Piece.KING]: './assets/white_king.svg',
    [PieceColor.WHITE | Piece.QUEEN]: './assets/white_queen.svg',
    [PieceColor.WHITE | Piece.KNIGHT]: './assets/white_knight.svg',
    [PieceColor.WHITE | Piece.ROOK]: './assets/white_rook.svg',

    [Piece.EMPTY]: './assets/transparent.svg'
}

const symbolToPiece = {
    'p': PieceColor.BLACK | Piece.PAWN,
    'r': PieceColor.BLACK | Piece.ROOK,
    'n': PieceColor.BLACK | Piece.KNIGHT,
    'b': PieceColor.BLACK | Piece.BISHOP,
    'q': PieceColor.BLACK | Piece.QUEEN,
    'k': PieceColor.BLACK | Piece.KING,


    'P': PieceColor.WHITE | Piece.PAWN,
    'R': PieceColor.WHITE | Piece.ROOK,
    'N': PieceColor.WHITE | Piece.KNIGHT,
    'B': PieceColor.WHITE | Piece.BISHOP,
    'Q': PieceColor.WHITE | Piece.QUEEN,
    'K': PieceColor.WHITE | Piece.KING,

    '.': Piece.EMPTY
}


interface vec2 {
    x: number,
    y: number
}

function one_to_2d(position): vec2 {
    return { x: Math.floor(position / 8), y: position % 8 }
}

function two_to_1d(position: vec2): number {
    return 8 * position.x + position.y;
}
function add_vec2(a: vec2, b: vec2) {
    return { x: a.x + b.x, y: a.y + b.y }
}

enum SquareType {
    EMPTY,
    ALLY,
    ENEMY,
    INVALID
}

export default class Engine {
    board: Piece[]
    active_color: PieceColor;
    constructor() {
        this.board = FEN.parse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').split("").map((symbol) => symbolToPiece[symbol]);
        this.active_color = PieceColor.WHITE;
    }
    makeMove(from_position: number, to_position: number) {
        let piece = this.board[from_position];
        if (this.active_color != this.getColor(piece)) {
            return;
        }
        let moves = this.getMoves(from_position);
        if (moves == null) {
            return;
        }
        if (moves.validMoves.includes(to_position) || moves.attackMoves.includes(to_position)) {
            this.board[to_position] = piece;
            this.board[to_position] = Piece.EMPTY;
            this.active_color = this.active_color == PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
        }
    }
    isEmpty(position: number) {
        return this.board[position] == Piece.EMPTY
    }
    getColor(piece: Piece): PieceColor {
        return piece >> 3 == 0 ? PieceColor.BLACK : PieceColor.WHITE
    }
    getMoves(current_position: number) {
        const current_piece = this.board[current_position];
        const piece_type = current_piece & 0b0111;
        const piece_color = this.getColor(current_piece);
        switch (piece_type) {
            case Piece.PAWN: return this.getPawnMoves(current_position, piece_color);
            case Piece.ROOK: return this.getRookMoves(current_position, piece_color);
            case Piece.BISHOP: return this.getBishopMoves(current_position, piece_color);
            case Piece.KNIGHT: return this.getKnightMoves(current_position, piece_color);
            case Piece.QUEEN: return this.getQueenMoves(current_position, piece_color);
            case Piece.KING: return this.getKingMoves(current_position, piece_color);
            case Piece.EMPTY: return null; // No moves!
        }
    }
    isValid(position: vec2) {
        return (0 <= position.x && position.x < 8) && (0 <= position.y && position.y < 8);
    }
    pokePosition(position: number, color: PieceColor) {
        if (!this.isValid(one_to_2d(position))) {
            return SquareType.INVALID;
        }
        if (this.isEmpty(position)) {
            return SquareType.EMPTY
        }
        if (color == this.getColor(this.board[position])) {
            // Enemy Piece!
            return SquareType.ALLY
        }
        return SquareType.ENEMY
    }
    getSlidingMoves(direction: vec2, inital_position: vec2, piece_color: PieceColor) {
        let running_position = add_vec2(inital_position, direction);
        let validMoves: number[] = [];
        let attackMoves: number[] = [];
        let poke_type = this.pokePosition(two_to_1d(running_position), piece_color);
        while (poke_type != SquareType.INVALID) {
            const one_d_pos = two_to_1d(running_position);
            if (poke_type == SquareType.EMPTY) validMoves.push(one_d_pos);
            else if (poke_type == SquareType.ENEMY) {
                attackMoves.push(one_d_pos);
                break;
            }
            else {
                // Ally.
                break;
            }
            running_position = add_vec2(running_position, direction);
            poke_type = this.pokePosition(two_to_1d(running_position), piece_color);
        }
        return { validMoves, attackMoves }
    }
    getPawnMoves(current_position: number, piece_color: PieceColor) {

        const current_position_2d = one_to_2d(current_position);

        let validMoves: number[] = [];
        let attackMoves: number[] = [];
        if (piece_color == PieceColor.WHITE) {

            let new_position = add_vec2(current_position_2d, { x: -1, y: 0 });
            let poke_position = this.pokePosition(two_to_1d(new_position), piece_color);
            if (poke_position == SquareType.EMPTY) {

                validMoves.push(two_to_1d(new_position));
                // Two moves only if at rank 6 and empty square
                console.log(new_position)

                if (current_position_2d.x == 6) {
                    new_position = add_vec2(new_position, { x: -1, y: 0 });
                    poke_position = this.pokePosition(two_to_1d(new_position), piece_color);
                    if (poke_position == SquareType.EMPTY) validMoves.push(two_to_1d(new_position));
                }
            }
        }
        else {
            let new_position = add_vec2(current_position_2d, { x: +1, y: 0 });
            let poke_position = this.pokePosition(two_to_1d(new_position), piece_color);
            if (poke_position == SquareType.EMPTY) {
                validMoves.push(two_to_1d(new_position));
                // Two moves only if at rank 1 and empty square
                if (current_position_2d.x == 1) {
                    new_position = add_vec2(new_position, { x: +1, y: 0 });
                    poke_position = this.pokePosition(two_to_1d(new_position), piece_color);
                    if (poke_position == SquareType.EMPTY) validMoves.push(two_to_1d(new_position));
                }
            }
        }
        return { validMoves, attackMoves }
    }
    getRookMoves(current_position: number, piece_color: PieceColor) {
        let dirs: vec2[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        let validMoves: number[] = [];
        let attackMoves: number[] = [];

        for (let dir of dirs) {
            const moves = this.getSlidingMoves(dir, one_to_2d(current_position), piece_color);
            validMoves.push(...moves.validMoves);
            attackMoves.push(...moves.attackMoves);
        }
        return { validMoves, attackMoves }
    }
    getBishopMoves(current_position: number, piece_color: PieceColor) {
        let dirs: vec2[] = [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }];
        let validMoves: number[] = [];
        let attackMoves: number[] = [];

        for (let dir of dirs) {
            const moves = this.getSlidingMoves(dir, one_to_2d(current_position), piece_color);
            validMoves.push(...moves.validMoves);
            attackMoves.push(...moves.attackMoves);
        }
        return { validMoves, attackMoves }
    }
    getKnightMoves(current_position: number, piece_color: PieceColor) {

        let moves = [
            { x: -2, y: -1 }, { x: -2, y: +1 },
            { x: -1, y: -2 }, { x: -1, y: +2 },

            { x: +1, y: -2 }, { x: +1, y: +2 },
            { x: +2, y: -1 }, { x: +2, y: +1 },
        ]
        let current_pos_vec2 = one_to_2d(current_position);
        let validMoves: number[] = [];
        let attackMoves: number[] = [];
        for (let move of moves) {
            let new_position = add_vec2(current_pos_vec2, move);
            const new_position_one_d = two_to_1d(new_position);
            if (this.isValid(new_position)) {
                if (this.isEmpty(new_position_one_d)) {
                    validMoves.push(new_position_one_d);
                }
                else if (piece_color != this.getColor(this.board[new_position_one_d])) {
                    // Enemy Piece!
                    attackMoves.push(new_position_one_d);
                }
            }

        }
        return { validMoves, attackMoves }
    }
    getQueenMoves(current_position: number, piece_color: PieceColor) {
        let dirs: vec2[] = [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        let validMoves: number[] = [];
        let attackMoves: number[] = [];

        for (let dir of dirs) {
            const moves = this.getSlidingMoves(dir, one_to_2d(current_position), piece_color);
            validMoves.push(...moves.validMoves);
            attackMoves.push(...moves.attackMoves);
        }
        return { validMoves, attackMoves }
    }
    getKingMoves(current_position: number, piece_color: PieceColor) {
        let dirs: vec2[] = [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        let current_pos_vec2 = one_to_2d(current_position);
        let validMoves: number[] = [];
        let attackMoves: number[] = [];
        for (let dir of dirs) {
            let new_position = add_vec2(current_pos_vec2, dir);
            const new_position_one_d = two_to_1d(new_position);
            if (this.isValid(new_position)) {
                if (this.isEmpty(new_position_one_d)) {
                    validMoves.push(new_position_one_d);
                }
                else if (piece_color != this.getColor(this.board[new_position_one_d])) {
                    // Enemy Piece!
                    attackMoves.push(new_position_one_d);
                }
            }

        }
        return { validMoves, attackMoves }
    }
    getImage(piece: Piece) {
        return PIECE_TO_IMAGE[piece]
    }
}