import {InBounds,isUnOccupied,Point,isEnemy} from '../script.js'

export default class King {
    constructor(type,position){
        this.color = type == 'K'
        this.position = position
        this.type = type
    }
    validMoves(){
        let {x,y} = this.position

        // Can move in all 8 directions
        
        let validMoves = []
        let attackMoves = []
        let moves = [
            [x-1,y-1],[x-1,y],[x-1,y+1],
            [x,y-1],      [x,y+1],
            [x+1,y-1],[x+1,y],[x+1,y+1]
        ]
        for(let move of moves){
            let [X,Y] = move
            if(InBounds(X,Y)){
                if(!isUnOccupied(X,Y) && isEnemy(X,Y,this.color)){ attackMoves.push(Point(X,Y)) }
                else{
                    if(isUnOccupied(X,Y)) validMoves.push(Point(X,Y));
                }
            }
        }

        return {validMoves,attackMoves}
    }
}
