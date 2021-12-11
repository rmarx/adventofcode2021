
{
    function execute(input:string) {
    
        // input = `5483143223
        // 2745854711
        // 5264556173
        // 6141336146
        // 6357385478
        // 4167524645
        // 2176841721
        // 6882881134
        // 4846848554
        // 5283751526`;

        // input = `11111
        // 19991
        // 19191
        // 19991
        // 11111`;

        // I don't feel like writing special logic on the edges of the board
        // so I just pad the 4 sides with a SENTINEL and start at x,y = (1,1) instead of (0,0) (and also end 1 earlier, of course)
        // we need to go to 100 iterations (at least for nr 1), so start sentinel much lower than that, so the edges never flash
        const SENTINEL = Number.MIN_SAFE_INTEGER;

        const inputs = input.split("\n").map( (str) => str.trim() );


        const board:number[][] = new Array<Array<number>>();

        for( const line of inputs ) {
            board[ board.length ] = line.split("").map( (str) => parseInt(str) );
            board[ board.length - 1 ].unshift( SENTINEL );
            board[ board.length - 1 ].push(    SENTINEL );
        }

        
        board.unshift( Array( board[0].length ).fill(SENTINEL) );
        board.push(    Array( board[0].length ).fill(SENTINEL) );

        // console.log( JSON.stringify(board) );

        // return execute1(board);
        return execute2(board);
    }
    
    function execute1(board:number[][]):void {
        
        const recursiveFlash = function( row:number, col:number, depth:number ):number {

            const FLASHED_SENTINEL = 666;

            if ( board[row][col] < 10 )
                return 0;

            if ( board[row][col] == FLASHED_SENTINEL )
                return 0;

            let result = 1;
            board[row][col] = FLASHED_SENTINEL;

            const directions = []; // offsets to row,col so we cover everything around current position
            directions.push( [ 0, -1 ] ); // left
            directions.push( [-1, -1 ] ); // up-left
            directions.push( [-1,  0 ] ); // up
            directions.push( [-1,  1 ] ); // up-right
            directions.push( [ 0,  1 ] ); // right
            directions.push( [ 1,  1 ] ); // bottom-right
            directions.push( [ 1,  0 ] ); // bottom
            directions.push( [ 1, -1 ] ); // bottom-left

            // board[row    ][col - 1] += 1; // left
            // board[row - 1][col - 1] += 1; // up-left
            // board[row - 1][col    ] += 1; // up
            // board[row - 1][col + 1] += 1; // up-right
            // board[row    ][col + 1] += 1; // right
            // board[row + 1][col + 1] += 1; // bottom-right
            // board[row + 1][col    ] += 1; // bottom
            // board[row + 1][col - 1] += 1; // bottom-left

            // I THINK it shouldn't matter if we first do everything + 1, then check for flashes
            // or do individual parts + 1 and check for a flash immediately
            // the second is easier to implement, so let's use that
            for ( const dir of directions ) {
                const tRow = row + dir[0];
                const tCol = col + dir[1];

                if ( board[tRow][tCol] != FLASHED_SENTINEL ) {
                    board[tRow][tCol] += 1;
                }

                // console.log( " ".repeat(depth) + " recflash ", tRow, tCol,  "@", depth );
                // console.log( stringBoard(depth) );

                result += recursiveFlash( tRow, tCol, depth + 1 );
            }

            return result;
        }   

        const stringBoard = function(depth:number) {
            let output = "";
            for ( let row = 1; row < board.length - 1; ++row ){
                output += " ".repeat(depth);

                for ( let col = 1; col < board[0].length - 1; ++col ) {
                    output += (" " + board[row][col]).padStart(4, " ");
                }

                output += "\n";
            }

            return output;
        }

        const iterations:number = 100;
        let flashCount:number = 0;

        console.log( stringBoard(0) );

        for ( let iteration = 0; iteration < iterations; ++iteration ){

            // step 1. update all in place ( .map() creates new arrays )
            board.forEach( (row) => row.forEach( (val, idx, arr) => arr[idx] = val + 1 ) );

            console.log( stringBoard(0) );

            // step 2. for each item > 9, it flashes
            // that means it increases the surroundings by +1 and updates the total flash counter by 1
            // each location can only flash once though... 
            for ( let row = 1; row < board.length - 1; ++row ){
                for ( let col = 1; col < board[0].length - 1; ++col ) {
                    flashCount += recursiveFlash( row, col, 0 );
                }
            }

            console.log("---------------------------------------- " + flashCount);
            
            // step 3. everything that's higher than 9 (meaning it has flashed) is set to 0
            board.forEach( (row) => row.forEach((val, idx, arr) => (arr[idx] = (val > 9) ? 0 : val )) );

            console.log( stringBoard(0) );
        }

        console.log("Flashcount", flashCount);

    }
    
    function execute2(board:number[][]):void {
    
        const recursiveFlash = function( row:number, col:number, depth:number ):number { // depth is just for debugging with stringBoard()

            const FLASHED_SENTINEL = 666;

            if ( board[row][col] < 10 ) // can't flash
                return 0;

            if ( board[row][col] == FLASHED_SENTINEL ) // has already flashed
                return 0;

            let result = 1;
            board[row][col] = FLASHED_SENTINEL; // this is > 9 and hasn't flashed yet: flash it!

            const directions = []; // offsets to row,col so we cover everything around current position
            directions.push( [ 0, -1 ] ); // left
            directions.push( [-1, -1 ] ); // up-left
            directions.push( [-1,  0 ] ); // up
            directions.push( [-1,  1 ] ); // up-right
            directions.push( [ 0,  1 ] ); // right
            directions.push( [ 1,  1 ] ); // bottom-right
            directions.push( [ 1,  0 ] ); // bottom
            directions.push( [ 1, -1 ] ); // bottom-left

            // board[row    ][col - 1] += 1; // left
            // board[row - 1][col - 1] += 1; // up-left
            // board[row - 1][col    ] += 1; // up
            // board[row - 1][col + 1] += 1; // up-right
            // board[row    ][col + 1] += 1; // right
            // board[row + 1][col + 1] += 1; // bottom-right
            // board[row + 1][col    ] += 1; // bottom
            // board[row + 1][col - 1] += 1; // bottom-left

            // I THINK it shouldn't matter if we first do everything + 1, then check for flashes
            // or do individual parts + 1 and check for a flash immediately
            // the second is easier to implement, so let's use that
            for ( const dir of directions ) {
                const tRow = row + dir[0];
                const tCol = col + dir[1];

                if ( board[tRow][tCol] != FLASHED_SENTINEL ) {
                    board[tRow][tCol] += 1;
                }

                result += recursiveFlash( tRow, tCol, depth + 1 );
            }

            return result;
        }   

        const stringBoard = function(depth:number) {
            let output = "";
            for ( let row = 1; row < board.length - 1; ++row ){
                output += " ".repeat(depth);

                for ( let col = 1; col < board[0].length - 1; ++col ) {
                    output += (" " + board[row][col]).padStart(4, " ");
                }

                output += "\n";
            }

            return output;
        }

        const iterations:number = 1000;
        let flashCount:number = 0;

        console.log( stringBoard(0) );

        for ( let iteration = 0; iteration < iterations; ++iteration ){

            // step 1. update all in place ( .map() creates new arrays )
            board.forEach( (row) => row.forEach( (val, idx, arr) => arr[idx] = val + 1 ) );

            console.log( stringBoard(0) );

            // step 2. for each item > 9, it flashes
            // that means it increases the surroundings by +1 and updates the total flash counter by 1
            // each location can only flash once though... 
            let currentFlashCount = 0;
            for ( let row = 1; row < board.length - 1; ++row ){
                for ( let col = 1; col < board[0].length - 1; ++col ) {
                    currentFlashCount += recursiveFlash( row, col, 0 );
                }
            }
            
            if ( currentFlashCount == (board.length - 2) * (board[0].length - 2) ) { // -2 because we add sentinels on 4 sides to make loops easier
                console.log("Everything flashed on iteration ", iteration + 1 ); // should be 471
                break;
            }


            console.log("---------------------------------------- " + flashCount);
            
            // step 3. everything that's higher than 9 (meaning it has flashed) is set to 0
            board.forEach( (row) => row.forEach((val, idx, arr) => (arr[idx] = (val > 9) ? 0 : val )) );

            console.log( stringBoard(0) );
        }
    }
    
    
    
    const input = `8448854321
    4447645251
    6542573645
    4725275268
    6442514153
    4515734868
    5513676158
    3257376185
    2172424467
    6775163586`;
    
    execute(input);
}