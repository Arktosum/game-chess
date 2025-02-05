
export default class FENParser {
    fen_string: string
    PLACEMENT_DATA: string
    ACTIVE_COLOR: string
    CASTLING_AVAILABILITY: string
    EN_PASSANT_TARGET_SQUARE: string
    HALF_MOVE_CLOCK: string
    FULL_MOVE_NUMBER: string
    constructor(fen_string: string) {
        this.fen_string = fen_string;
        const fields = fen_string.split(' ');
        this.PLACEMENT_DATA = fields[0];
        this.ACTIVE_COLOR = fields[1];
        this.CASTLING_AVAILABILITY = fields[2];
        this.EN_PASSANT_TARGET_SQUARE = fields[3];
        this.HALF_MOVE_CLOCK = fields[4];
        this.FULL_MOVE_NUMBER = fields[5];
    }
    getBoard() {
        const ranks = this.PLACEMENT_DATA.split('/');
        let board: string[] = [];

        for (let i = 0; i < ranks.length; i++) {
            for (let j = 0; j < ranks[i].length; j++) {
                let symbol = ranks[i][j];
                if (!isNaN(parseInt(symbol))) {
                    // Digit.
                    const count = parseInt(symbol);
                    for (let k = 0; k < count; k++) {
                        board.push('.');
                    }
                }
                else {
                    board.push(symbol);
                }
            }
        }
        return board;
    }
}