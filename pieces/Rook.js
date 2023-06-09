import {InBounds,isUnOccupied,Point,isEnemy} from '../script.js'

export default class Rook{
    constructor(type,position){
        this.color = type == 'R'
        this.position = position
        this.type = type
    }
    validMoves(){
        let {x,y} = this.position
        // Up down left right till a piece blocks (friendly or not friendly).


        let validMoves= []
        let attackMoves = []

        // RIGHT
        let offset = 1;
        while(InBounds(x,y+offset)){
            if(!isUnOccupied(x,y+offset)){
                if(isEnemy(x,y+offset,this.color)) attackMoves.push(Point(x,y+offset));
                break;
            }
            validMoves.push(Point(x,y+offset));
            offset++;
        }
        
        // LEFT
        offset = 1;
        while(InBounds(x,y-offset)){
            if(!isUnOccupied(x,y-offset)){
                if(isEnemy(x,y-offset,this.color)) attackMoves.push(Point(x,y-offset));
                break;
            }
            validMoves.push(Point(x,y-offset));
            offset++;
        }
        // DOWN
        offset = 1;
        while(InBounds(x+offset,y)){
            if(!isUnOccupied(x+offset,y)){
                if(isEnemy(x+offset,y,this.color)) attackMoves.push(Point(x+offset,y));
                break;
            }
            validMoves.push(Point(x+offset,y));
            offset++;
        }
        //UP
        offset = 1;
        while(InBounds(x-offset,y)){
            if(!isUnOccupied(x-offset,y)){
                if(isEnemy(x-offset,y,this.color)) attackMoves.push(Point(x-offset,y));
                break;
            }
            validMoves.push(Point(x-offset,y));
            offset++;
        }
        return {validMoves,attackMoves};


    }
}
