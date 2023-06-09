import {InBounds,isUnOccupied,Point,isEnemy} from '../script.js'

export default class Pawn{
    constructor(type,position){
        this.color = type == 'P'
        this.position = position
        this.type = type
        this.isFirstMove = true;
    }
    validMoves(){
        let {x,y} = this.position
        let validMoves = []
        let attackMoves = []
        let offset = -1*(this.color ? 1 : -1);

        if(InBounds(x+offset,y) && isUnOccupied(x+offset,y)){
            validMoves.push(Point(x+offset,y));
            // Can only move to second if first is possible
            if(this.isFirstMove && InBounds(x+offset*2,y) && isUnOccupied(x+offset*2,y)) validMoves.push(Point(x+offset*2,y));
        }
        if(InBounds(x+offset,y+1) && !isUnOccupied(x+offset,y+1) && isEnemy(x+offset,y+1,this.color)) attackMoves.push(Point(x+offset,y+1));
        if(InBounds(x+offset,y-1) && !isUnOccupied(x+offset,y-1) && isEnemy(x+offset,y-1,this.color)) attackMoves.push(Point(x+offset,y-1));
        return {validMoves,attackMoves};

    }
    attackMoves(){

    }
}