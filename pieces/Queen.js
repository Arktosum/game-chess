import {InBounds,isUnOccupied,Point,isEnemy} from '../script.js'

export default class Queen {
    constructor(type,position){
        this.color = type == 'Q'
        this.position = position
        this.type = type
    }
    orthogonalMoves(){
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
    diagonalMoves(){
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
    validMoves(){
       let orthogonal = this.orthogonalMoves();
       let diagonal = this.diagonalMoves();

       let validMoves = [...orthogonal.validMoves,...diagonal.validMoves];
       let attackMoves = [...orthogonal.attackMoves,...diagonal.attackMoves];
       return {validMoves,attackMoves};
    }
}
