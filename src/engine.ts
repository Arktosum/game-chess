import FEN from "./fen";


enum PieceColor {
    BLACK,
    WHITE
}


enum PieceType {
    PAWN,
    KNIGHT,
    ROOK,
    BISHOP,
    QUEEN,
    KING
}

const PieceMap = {
    'r': PieceType.ROOK | PieceColor.BLACK,
    'b': PieceType.BISHOP | PieceColor.BLACK,
    'k': PieceType.KING | PieceColor.BLACK,
    'q': PieceType.QUEEN | PieceColor.BLACK,
    'n': PieceType.KNIGHT | PieceColor.BLACK,
    'p': PieceType.PAWN | PieceColor.BLACK,

    'R': PieceType.ROOK | PieceColor.WHITE,
    'B': PieceType.BISHOP | PieceColor.WHITE,
    'K': PieceType.KING | PieceColor.WHITE,
    'Q': PieceType.QUEEN | PieceColor.WHITE,
    'N': PieceType.KNIGHT | PieceColor.WHITE,
    'P': PieceType.PAWN | PieceColor.WHITE,
}

class ChessEngine {
    turn: PieceColor;
    board: string;
    constructor() {
        this.reset();
    }
    getAllMoves(pieceSymbol: string, current_position: number) {
        const piece = PieceMap[pieceSymbol]

        switch (piece) {
            case PieceType.PAWN: return this.generatePawnMoves(current_position);
            case PieceType.BISHOP: return this.generateBishopMoves(current_position);
            case PieceType.KING: return this.generateKingMoves(current_position);
            case PieceType.QUEEN: return this.generateQueenMoves(current_position);
            case PieceType.KNIGHT: return this.generateKnightMoves(current_position);
            case PieceType.ROOK: return this.generateRookMoves(current_position);
        }
    }

    generateSlidingMoves(direction, piece_color, current_position) {

    }
    generatePawnMoves(current_position: number) {
        throw new Error("Method not implemented.");
    }
    generateBishopMoves(current_position: number) {
        throw new Error("Method not implemented.");
    }
    generateKingMoves(current_position: number) {
        throw new Error("Method not implemented.");
    }
    generateQueenMoves(current_position: number) {
        throw new Error("Method not implemented.");
    }
    generateKnightMoves(current_position: number) {
        throw new Error("Method not implemented.");
    }
    generateRookMoves(current_position: number) {
        throw new Error("Method not implemented.");
    }
    reset() {
        this.board = FEN.parse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        this.turn = PieceColor.WHITE;
    }
}

