
export default class Piece {
    symbol: string
    color: boolean
    constructor(symbol: string) {
        this.symbol = symbol;
        this.color = this.symbol == this.symbol.toUpperCase();
        // TRUE : WHITE , FALSE : BLACKs
    }
    static getImage(symbol: string) {
        let image_sources: Record<string, string> = {
            'r': "./assets/black_rook.svg",
            'k': "./assets/black_king.svg",
            'n': "./assets/black_knight.svg",
            'p': './assets/black_pawn.svg',
            'b': "./assets/black_bishop.svg",
            'q': "./assets/black_queen.svg",

            'R': "./assets/white_rook.svg",
            'K': "./assets/white_king.svg",
            'N': "./assets/white_knight.svg",
            'P': './assets/white_pawn.svg',
            'B': "./assets/white_bishop.svg",
            'Q': "./assets/white_queen.svg",
        }
        return image_sources[symbol];
    }
}