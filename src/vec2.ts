export interface vec2 {
    x: number,
    y: number,
    position?: number
}

export function one_to_2d(position: number): vec2 | null {
    if (!(0 <= position && position < 64)) return null;
    return { x: Math.floor(position / 8), y: position % 8, position }
}

function isValid(x: number, y: number) {
    return (0 <= x) && (x < 8) && (0 <= y) && (y < 8)
}
export function addVec2(A: vec2, B: vec2): vec2 | null {
    let new_x = A.x + B.x;
    let new_y = A.y + B.y;
    if (!isValid(new_x, new_y)) return null;
    return { x: new_x, y: new_y, position: 8 * new_x + new_y }
}