import {InBounds,isUnOccupied,Point,isEnemy} from '../script.js'

export default class Bishop{
    constructor(type,position){
        this.color = type == 'B'
        this.position = position
        this.type = type
    }
    validMoves(){
        let {x,y} = this.position
        // Up down left right till a piece blocks (friendly or not friendly).


        let validMoves= []
        let attackMoves = []
        // top  (x-1)
        // right (y+1)
        // bottom (x+1)
        // left (y-1)

        // TOP LEFT (x-1,y-1)
        let xoffs = -1;
        let yoffs = -1;
        while(InBounds(x+xoffs,y+yoffs)){
            if(!isUnOccupied(x+xoffs,y+yoffs)){
                if(isEnemy(x+xoffs,y+yoffs,this.color)) attackMoves.push(Point(x+xoffs,y+yoffs));
                break;
            }
            validMoves.push(Point(x+xoffs,y+yoffs));
            xoffs--;
            yoffs--;
        }
        // TOP RIGHT (x-1,y+1)
        xoffs = -1;
        yoffs = 1;
        while(InBounds(x+xoffs,y+yoffs)){
            if(!isUnOccupied(x+xoffs,y+yoffs)){
                if(isEnemy(x+xoffs,y+yoffs,this.color)) attackMoves.push(Point(x+xoffs,y+yoffs));
                break;
            }
            validMoves.push(Point(x+xoffs,y+yoffs));
            xoffs--;
            yoffs++;
        }

        // BOTTOM LEFT (x+1,y-1)
        xoffs = +1;
        yoffs = -1;
        while(InBounds(x+xoffs,y+yoffs)){
            if(!isUnOccupied(x+xoffs,y+yoffs)){
                if(isEnemy(x+xoffs,y+yoffs,this.color)) attackMoves.push(Point(x+xoffs,y+yoffs));
                break;
            }
            validMoves.push(Point(x+xoffs,y+yoffs));
            xoffs++;
            yoffs--;
        }
        // TOP RIGHT (x+1,y+1)
        xoffs = 1;
        yoffs = 1;
        while(InBounds(x+xoffs,y+yoffs)){
            if(!isUnOccupied(x+xoffs,y+yoffs)){
                if(isEnemy(x+xoffs,y+yoffs,this.color)) attackMoves.push(Point(x+xoffs,y+yoffs));
                break;
            }
            validMoves.push(Point(x+xoffs,y+yoffs));
            xoffs++;
            yoffs++;
        }


        return {validMoves,attackMoves};


    }
}

