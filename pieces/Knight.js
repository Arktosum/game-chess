import {InBounds,isUnOccupied,Point,isEnemy} from '../script.js'

export default class Knight {
    constructor(type,position){
        this.color = type == 'N'
        this.position = position
        this.type = type
    }
    validMoves(){
        let {x,y} = this.position
        let validMoves = []
        let attackMoves = []
        let candidates = [
            [x+2,y-1],[x-2,y-1],[x+2,y+1],[x-2,y+1],
            [x-1,y-2],[x-1,y+2],[x+1,y-2],[x+1,y+2],
        ]
        for(let candidate of candidates){
            let [X,Y] = candidate
            if(InBounds(X,Y) && isUnOccupied(X,Y)){
                validMoves.push(Point(X,Y));
            }
            if(InBounds(X,Y) && !isUnOccupied(X,Y) && isEnemy(X,Y,this.color)){
                attackMoves.push(Point(X,Y));
            }

        }
       
        return {validMoves,attackMoves};


    }
}
