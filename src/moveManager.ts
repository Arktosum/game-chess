export default class MoveManager {
    board: string[]
    constructor(board: string[]) {
        this.board = board;
    }
    getColor(symbol: string): boolean {
        return symbol == symbol.toUpperCase();
    }
    getMove(symbol: string, position: number): [number[], number[]] {
        switch (symbol.toLowerCase()) {
            case 'r': return this.rookMovement(symbol, position);
            case 'q': return this.queenMovement(symbol, position);
            case 'p': return this.pawnMovement(symbol, position);
            case 'k': return this.kingMovement(symbol, position);
            case 'n': return this.knightMovement(symbol, position);
            case 'b': return this.bishopMovement(symbol, position);
            default: return [[], []]
        }
    }
    pawnMovement(symbol: string, position: number): [number[], number[]] {
        const color = this.getColor(symbol);
        const row = Math.floor(position / 8);
        const col = position % 8;
        let movePositions: number[] = [];
        let attackPositions: number[] = [];


        if (!color) {
            // Black pawn
            const IS_STARTING_RANK = row == 1;

            // Move one forward.
            const check = this.checkPosition(row + 1, col, color);
            if (check == 0) {
                movePositions.push((row + 1) * 8 + col);
                if (IS_STARTING_RANK) {
                    const check_second = this.checkPosition(row + 2, col, color);
                    if (check_second == 0) {
                        movePositions.push((row + 2) * 8 + col);
                    }
                }
            }
            const has_left_enemy = this.checkPosition(row + 1, col - 1, color) == -1;
            const has_right_enemy = this.checkPosition(row + 1, col + 1, color) == -1;
            if (has_left_enemy) {
                attackPositions.push((row + 1) * 8 + col - 1)
            }
            if (has_right_enemy) {
                attackPositions.push((row + 1) * 8 + col + 1);
            }
        } else {
            // White pawn
            const IS_STARTING_RANK = row == 6;

            // Move one forward.
            const check = this.checkPosition(row - 1, col, color);
            if (check == 0) {
                movePositions.push((row - 1) * 8 + col);
                if (IS_STARTING_RANK) {
                    const check_second = this.checkPosition(row - 2, col, color);
                    if (check_second == 0) {
                        movePositions.push((row - 2) * 8 + col);
                    }
                }
            }
            const has_left_enemy = this.checkPosition(row - 1, col - 1, color) == -1;
            const has_right_enemy = this.checkPosition(row - 1, col + 1, color) == -1;
            if (has_left_enemy) {
                attackPositions.push((row - 1) * 8 + col - 1)
            }
            if (has_right_enemy) {
                attackPositions.push((row - 1) * 8 + col + 1);
            }
        }

        return [movePositions, attackPositions]
    }
    queenMovement(symbol: string, position: number): [number[], number[]] {
        const color = this.getColor(symbol);
        const row = Math.floor(position / 8);
        const col = position % 8;
        let movePositions: number[] = [];
        let attackPositions: number[] = [];

        let directions = [
            [1, 1], [-1, -1], [-1, 1], [1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]
        ]

        for (let i = 0; i < directions.length; i++) {
            let [dir_row, dir_col] = directions[i];
            let direction_moves = this.movePieceByDirection({ row: row, col: col }, { row: dir_row, col: dir_col }, color);
            movePositions = [...movePositions, ...direction_moves[0]];
            attackPositions = [...attackPositions, ...direction_moves[1]];
        }

        return [movePositions, attackPositions]

    }
    bishopMovement(symbol: string, position: number): [number[], number[]] {
        const color = this.getColor(symbol);
        const row = Math.floor(position / 8);
        const col = position % 8;
        let movePositions: number[] = [];
        let attackPositions: number[] = [];

        let directions = [
            [1, 1], [-1, -1], [-1, 1], [1, -1]
        ]

        for (let i = 0; i < directions.length; i++) {
            let [dir_row, dir_col] = directions[i];
            let direction_moves = this.movePieceByDirection({ row: row, col: col }, { row: dir_row, col: dir_col }, color);
            movePositions = [...movePositions, ...direction_moves[0]];
            attackPositions = [...attackPositions, ...direction_moves[1]];
        }

        return [movePositions, attackPositions]

    }
    checkInBounds(row: number, col: number): boolean {
        return 0 <= row && row < 8 && 0 <= col && col < 8;
    }
    checkPosition(row: number, col: number, color: boolean): number {
        // invalid = -2
        // ally = 1
        // enemy = -1
        // empty = 0
        const position = 8 * row + col;
        if (!this.checkInBounds(row, col)) return -2; // Invalid position
        if (this.board[position] == '.') return 0;
        return color == this.getColor(this.board[position]) ? 1 : -1;
    }
    knightMovement(symbol: string, position: number): [number[], number[]] {
        const color = this.getColor(symbol);
        let movePositions: number[] = [];
        let attackPositions: number[] = [];
        const position_offsets = [
            [-2, -1], [-2, +1],
            [-1, -2], [-1, +2],
            [+1, -2], [+1, +2],
            [+2, -1], [+2, +1],
        ]
        const row = Math.floor(position / 8);
        const col = position % 8;
        for (let offsets of position_offsets) {
            const [new_row_offset, new_col_offset] = offsets
            const new_row = row + new_row_offset;
            const new_col = col + new_col_offset;
            const new_position = 8 * new_row + new_col;
            const check = this.checkPosition(new_row, new_col, color);
            if (check == 0) {
                movePositions.push(new_position)
            }
            else if (check == -1) {
                attackPositions.push(new_position)
            }
        }
        return [movePositions, attackPositions]
    }
    kingMovement(symbol: string, position: number): [number[], number[]] {
        const color = this.getColor(symbol);
        let movePositions: number[] = [];
        let attackPositions: number[] = [];
        const position_offsets = [
            [1, 1], [-1, -1], [-1, 1], [1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]
        ]
        const row = Math.floor(position / 8);
        const col = position % 8;
        for (let offsets of position_offsets) {
            const [new_row_offset, new_col_offset] = offsets
            const new_row = row + new_row_offset;
            const new_col = col + new_col_offset;
            const new_position = 8 * new_row + new_col;
            const check = this.checkPosition(new_row, new_col, color);
            if (check == 0) {
                movePositions.push(new_position)
            }
            else if (check == -1) {
                attackPositions.push(new_position)
            }
        }
        return [movePositions, attackPositions]
    }
    movePieceByDirection(current_position: { row: number, col: number }, direction: { row: number, col: number }, color: boolean) {
        let movePositions: number[] = [];
        let attackPositions: number[] = [];
        while (this.checkInBounds(current_position.row, current_position.col)) {
            let new_position = { row: current_position.row + direction.row, col: current_position.col + direction.col };
            let new_index = new_position.row * 8 + new_position.col
            const status = this.checkPosition(new_position.row, new_position.col, color)
            if (status == 0) {
                movePositions.push(new_index);
            }
            else if (status == -1) {
                attackPositions.push(new_index);
                break;
            }
            else {
                // Either out of bounds , ally.
                break;
            }
            current_position = { ...new_position };
        }
        return [movePositions, attackPositions]
    }
    rookMovement(symbol: string, position: number): [number[], number[]] {
        const color = this.getColor(symbol);
        const row = Math.floor(position / 8);
        const col = position % 8;
        let movePositions: number[] = [];
        let attackPositions: number[] = [];

        let directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ]

        for (let i = 0; i < directions.length; i++) {
            let [dir_row, dir_col] = directions[i];
            let direction_moves = this.movePieceByDirection({ row: row, col: col }, { row: dir_row, col: dir_col }, color);
            movePositions = [...movePositions, ...direction_moves[0]];
            attackPositions = [...attackPositions, ...direction_moves[1]];
        }

        return [movePositions, attackPositions]
    }
}