{
    function execute(input:string) {
    
        // input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

        // 22 13 17 11  0
        //  8  2 23  4 24
        // 21  9 14 16  7
        //  6 10  3 18  5
        //  1 12 20 15 19
        
        //  3 15  0  2 22
        //  9 18 13 17  5
        // 19  8  7 25 23
        // 20 11 10 24  4
        // 14 21 16 12  6
        
        // 14 21 17 24  4
        // 10 16 15  9 19
        // 18  8 23 26 20
        // 22 11 13  6  5
        //  2  0 12  3  7`;

        const inputs = input.split("\n").map( (str) => str.trim() );


        const drawnNumbers:Array<number> = inputs[0].split(",").map( (str) => parseInt(str) );
        const boards:Array<Array<Array<number>>> = [];

        for( let lineIndex = 1; lineIndex < inputs.length; ++lineIndex ){
            const line:string = inputs[lineIndex];

            if ( line === "" ) {
                boards.push([]);
            }
            else {
                const numbers = line.split(/[ ]+/).map( (str) => parseInt(str) );
                
                boards[ boards.length - 1 ].push( numbers );
            }
        }

        // return execute1(drawnNumbers, boards);
        return execute2(drawnNumbers, boards);
    }
    
    function execute1(drawnNumbers:Array<number>, boards:Array<Array<Array<number>>>):void {
        
        // we have to somehow keep state of which numbers were drawn and which weren't
        // we could do this with a separate (boolean) 2D array for each board, but that is wasting some space
        // looking at the mission, we don't need the drawn numbers later, only the UNdrawn ones to calculate the result
        // so, we can just re-use the existing memory by setting drawn numbers to a sentinel value!

        // Alternative method would be to keep all drawnNumbers in an array, and then do something like
        // - if all numbers in the current row/column are in the current drawnNumbers (e.g., filter( rowNr => rowNr in drawnNumbers ) == row.length )
        // of course, I only think of this AFTER implementing the other method below... sjeez

        const SENTINEL = -1;

        // check if the current row or column is completely full with sentinels now
        const checkWinningBoard = function(board:Array<Array<number>>, rowIndex:number, columnIndex:number):boolean {

            let row = board[rowIndex];

            if ( row.filter( (nr) => nr === SENTINEL ).length == row.length ) {
                return true;
            }
            else {
                for ( let rowIndex = 0; rowIndex < board.length; ++rowIndex ) {
                    if ( board[rowIndex][columnIndex] != SENTINEL ) {
                        return false;
                    }
                }

                return true;
            }
        }

        for ( let [numberIndex, drawnNumber] of drawnNumbers.entries() ){

            for ( let [boardIndex, board] of boards.entries() ) {

                const rows = board; // just for easier to read code

                for ( let rowIndex = 0; rowIndex < rows.length; ++rowIndex ) {
                    const row = rows[rowIndex];

                    for ( let columnIndex = 0; columnIndex < row.length; ++columnIndex ){
                        const nr = row[columnIndex];


                        if ( nr == drawnNumber ) {
                            row[columnIndex] = SENTINEL;

                            // extra optimization: can't have a full row/column if there haven't been enough numbers drawn!
                            if ( numberIndex > rows.length || numberIndex > row.length ) {

                                console.log("CHECKING", board, rowIndex, columnIndex, drawnNumber);

                                const chickenDinner:boolean = checkWinningBoard( board, rowIndex, columnIndex);

                                if ( chickenDinner ) {

                                    // sum of all non-SENTINEL values
                                    let sum = 0;
                                    for ( let finalRow of board ) {
                                        sum += finalRow.filter( (nr) => nr !== SENTINEL ).reduce( (a,b) => a + b, 0);
                                    }

                                    console.log("FOUND WINNING BOARD", boardIndex, drawnNumber, sum, "result", sum * drawnNumber ); // should be 23, 42, 794, result, 33348

                                    return; // real could would probably terminate a bit cleaner ;) 
                                }
                            }
                        }
                    }
                }
            }   
        }

    }
    
    function execute2(drawnNumbers:Array<number>, boards:Array<Array<Array<number>>>):void {
    
        const SENTINEL = -1;

        // check if the current row or column is completely full with sentinels now
        const checkWinningBoard = function(board:Array<Array<number>>, rowIndex:number, columnIndex:number):boolean {

            let row = board[rowIndex];

            if ( row.filter( (nr) => nr === SENTINEL ).length == row.length ) {
                // console.log("Found full row!");
                return true;
            }
            else {
                for ( let rowIndex = 0; rowIndex < board.length; ++rowIndex ) {
                    if ( board[rowIndex][columnIndex] != SENTINEL ) {
                        return false;
                    }
                }

                return true;
            }
        }

        const wonBoardsIndices = [];
        const winningNumbersInSequence = [];

        for ( let [numberIndex, drawnNumber] of drawnNumbers.entries() ){

            for ( let [boardIndex, board] of boards.entries() ) {

                // board has already won, no need to check nor update with SENTINEL so we can use the leftover state later to calculate the score
                if ( wonBoardsIndices.indexOf(boardIndex) >= 0 ) 
                    continue;

                const rows = board; // just for easier to read code

                for ( let rowIndex = 0; rowIndex < rows.length; ++rowIndex ) {
                    const row = rows[rowIndex];

                    for ( let columnIndex = 0; columnIndex < row.length; ++columnIndex ){
                        const nr = row[columnIndex];


                        if ( nr == drawnNumber ) {
                            row[columnIndex] = SENTINEL;

                            // extra optimization: can't have a full row/column if there haven't been enough numbers drawn!
                            if ( numberIndex > rows.length || numberIndex > row.length ) {

                                console.log("CHECKING", board, rowIndex, columnIndex, drawnNumber);

                                const chickenDinner:boolean = checkWinningBoard( board, rowIndex, columnIndex);

                                if ( chickenDinner ) {
                                    wonBoardsIndices.push( boardIndex );
                                    winningNumbersInSequence.push( drawnNumber );
                                }
                            }
                        }
                    }
                }
            }   
        }

        let lastWinningBoard = boards[ wonBoardsIndices[ wonBoardsIndices.length - 1 ]];
        let lastWinningNumber = winningNumbersInSequence[ winningNumbersInSequence.length - 1];

        let sum = 0;
        for ( let finalRow of lastWinningBoard ) {
            sum += finalRow.filter( (nr) => nr !== SENTINEL ).reduce( (a,b) => a + b, 0);
        }       

        console.log("Last winning board", wonBoardsIndices[ wonBoardsIndices.length - 1 ], lastWinningNumber, sum, "result", sum * lastWinningNumber ); // should be 39, 208, result, 8112

    }
    
    
    
    const input = `23,91,18,32,73,14,20,4,10,55,40,29,13,25,48,65,2,80,22,16,93,85,66,21,9,36,47,72,88,58,5,42,53,69,52,8,54,63,76,12,6,99,35,95,82,49,41,17,62,34,51,77,94,7,28,71,92,74,46,79,26,19,97,86,87,37,57,64,1,30,11,96,70,44,83,0,56,90,59,78,61,98,89,43,3,84,67,38,68,27,81,39,15,50,60,24,45,75,33,31

    67 97 50 51  1
    47 15 77 31 66
    24 14 55 70 52
    76 46 19 32 73
    34 22 54 75 17
    
    44 11 97 50 71
    66  7 24  9 67
    88 39 82 93 57
    77  5  6 58 51
    85 61 65 70 23
    
    72 74 58 71 41
     4 57 45 89 67
    78 55 66 28 48
    82 61 87 85 84
    96  8 94 76 97
    
    25 33 45 16 68
    60 27 22 13 29
    92 95 93 50 36
    43  1 66 51 99
    85 14 20 52 58
    
    65 47 18 50 90
    44 25 11 70 81
    86 36 45 10 85
    43 89 74  0 14
    97 59 32 91  5
    
    64 19 39 69 90
    41  5 59 37 42
    75 95 58 89 92
    20  3 85 48 71
    31 94 11 18 70
    
    30 17 56 54 79
    63 12 51 57  5
    95 16 98 75 69
    80 87 71 39 48
    66 14 99 42 31
    
    27 35 46 69 50
     3 16 84 39 42
    19 22 34 80 72
    40 54 66 30 10
    12 67 36  9 74
    
    39 47 61  3 35
    15 33 45 79 58
    96 53 20 80 19
    75 85 73  6 64
    43 88 72 69 37
    
    52 68 12 23 59
    79 32 37 87 69
    48 31  4 36 51
    77  2 92 67  8
    13 88 93 98 20
    
    12 54 34 13 27
    79 85 62 76 71
    52 84 65 93 66
    40 89 73 95 74
    29 70 32 11 41
    
    54 56 53 55 78
    21 85 43 75 79
    62 66 14 84  2
    32 13 83 38  7
    15 71 81 63 49
    
    83  7 51 49 50
    89 59  9 72 80
    99 41 65 13 64
    74 95 75 54 90
    53 79 58 40  5
    
    36 16 46 71 87
    73 13 84  3 38
    69 88 85 28 68
    63 94  0 86  1
    49 44 65 39 15
    
    55 27 91 44 39
     6 75 14 22 99
    38 89 92 42 11
    20 60  3 70 15
     5 19 78 88 81
    
    16 90 29 52 86
    60 61 96 47 91
    19 59 10 14  4
    18 35 50 20 25
    56  2 99 63 72
    
    66 54 87  7 98
    55 45 62 38 99
    13 23 76 30  3
    75 68  5 51 46
     0 60 71 70 41
    
    22 77 65 72 27
    88  9 25 44  0
    61  6 46 41 26
    74 78 20 86 87
    70 81  4  5 48
    
    41 51  8 64 50
    96 40 45 85 53
    18 86 24 29 27
    90 11 39 82 88
    12 56 54 87 59
    
    90 79 64 77 78
    97 12 72 27 86
    32 56 33 18 46
    95  5 51  6 80
    34 38 42 35 52
    
    66 10 82 90 19
    38 69 71 77 72
    61  9 98 86 93
    56  7 88 28 47
    22 96 21 52 64
    
    91 82 25 93 69
    95 79 84 35 90
    48  0 28 41 83
    23 55 88 71 65
    97 19 67 31 59
    
    47 60 65 11 85
    97 36 64 96 70
    82 84 76 89 44
    67 26 28 21 41
    63 54 94 10 34
    
    24 19 78  4 69
    52 38  7 58 21
    20 23 10 91 42
    44 36 25 45 49
    94 51 98 99 27
    
    67 25 54 28 71
     9 14 89 91 46
    65  1 55 88 19
    59 45 26 84 73
    83 62 50 42 97
    
    58 51 29 60 94
    34 79 39 19 91
     9 81 93 35 70
     4 23 80 33 75
    73 69  7 49 59
    
    44 83 20 24 56
    41 50 77 55 10
    79 49 67 99 16
    36 57 33 15 98
    40 76  4 53 39
    
    59 92 67  6 80
    64 90 15 40  7
    36 96 62 25 32
    44 91 52 43 19
     5  2 51 88 87
    
     4 97 70 78 59
    90 43 62 50 41
    61 64  2 91 49
    19 82 85 30 73
    15 51 36 11 34
    
    97  7 86 64 40
    15 46 84  0 58
    54 87 73 93 20
    48 94 32  4 77
    13 85 72 50 36
    
    68 54 94 71 83
    81 53 33 12 58
    22 67 52 21 25
    79 90 59 92 41
    29 11 76 98 85
    
    10 25 64  3 83
    21 87 97 78  7
    44 71 48 22 74
    80 72 90 29 63
     1 24 32 84 13
    
    25 28 19 65 24
    98 32  4  6 99
     7  0 27 37 35
    72 11  1 76 73
    49 85 83 93 14
    
    78 91 50 45 29
    35 27 18 48 87
     3 56 60 99 64
    84 61 15 77 40
    58 39 19  0 92
    
    98 38 88 43 39
    48 93  4 52 66
    57 99 83 55 25
    91 35 42 12 23
    40 15 81 94 77
    
    85 28 95 76 78
    39 66 18 47 49
    32 77 34 12 58
    69 15 45  6 41
     3 51 25 40 63
    
    58 97 10  5 57
    47 86 24 78 98
    89 25 39 73 83
    11 15 99 68 66
    84 70 61 76 30
    
    67 40 29 75 90
    71 31 41 37 52
    61  0 86 84 94
    25 96  9 21  6
    39 62 14  1 81
    
    15 65 47 63 94
    82 21 32 38 67
    12 20 30 91 68
    16 79  4 28 45
     1 70 84 49 78
    
    80 21 39 92 71
    48  8 87  0 38
    74  4 52 23 98
    53 89 61 30 46
    29 10 64 49  5
    
    40  2 62 39 51
     4 24 19 73 75
    86 14 97 91 11
    43  7 77 71 28
    32 63  6 20  8
    
    90 57 28 47 23
    10 41 77 52 31
    45 18 55 80 49
    76 50 16 96 81
    91 75 93 68 58
    
    63 87 12 16 60
    36 52 94 39 91
    67 56 24 18 26
    73 80 46  1 84
    30 74  6 61 75
    
    98 32 56 51 44
    58 78 71 74 26
    55 45 83 10 30
    54 47 93 62 23
    15 67 53 21 49
    
    59 93 49 65 42
     9 74 58 52 18
     1 47 71 25 68
    45 92 67 60 73
    97 63 61 34 36
    
    73 74  6 68 40
    76 85  1 26 91
    90 94 39 92 17
    80 51 20 77 67
    54 88 21 57 83
    
    14 52 70 30 32
    60 69 75 10 24
    65 40 72 71 58
    80 73 84 96  4
    62  9 28 41 36
    
    56  2 83  9 50
    75 42  5  3 72
    73 28 34 76 38
    49 33 30 80 46
    37 77 55 45 74
    
    40 69 31 88  8
    58 27 78 26 95
    73 86  1 34 79
    12 83  2 75 92
     0 48 63 17 65
    
     3 87 59 76 24
    90 10 44 28 21
    83 19 77 86 51
    81 88 42 94 15
    27 78 92 34 30
    
    44 23 83 22 87
    75 53 91 93 89
    88 40 56 46 37
     0  4 80 24  7
    97 72 96 12 68
    
    40 45 61 84 31
    85 12 27 82 50
     4 49 33  6 44
    51 36 15  0 14
    68 77 64 11 79
    
    31 79 50 63 59
    13  4  6 54  7
    86 30 41 68 34
    16 35 48 11 70
    84  8 81 65 74
    
    75 33 21 60 57
     7 86 82 18 68
    40 91  0 28 38
    90 36 92 94 55
    95 88 85 62 25
    
     7  5 75 36 74
    40 37 58 92 93
    46 68 24 98 34
    32 88 67 62 53
    83 84 90 31 63
    
    17 24 25 93 37
    16 36 59 81 41
    99 51 12 77 98
    80 32 28 18 39
    44 85 38 64 73
    
    83 18 86 33 61
    21 88 94 62 67
    40 25 97 27 73
    71 90 63 87  6
    16  7 36 92 69
    
    69 67 35 24 84
    79 44 66 37 75
     0 73 53 80 15
    74 20 32 12 60
    36 22 29 85 82
    
    49 72 69 33 10
    45 81 43  0 22
    12 76  5 29 52
    82 40 42 63 85
     1 34 32 66 15
    
    82 41 16 67 23
    30 84 25 88 48
    75 71 43  0  2
    35  3 68 26 50
    64 24  8 89 98
    
    61 23 63 51 46
    21 59 99 97 91
    60 34 42 26 31
    12 64 38 96 24
     5 13 90 37 94
    
    97  0 20 61 96
    92 39 43 57 64
    87 52 16 85 45
    60 41 86  6 53
    75 10 24 21 37
    
    37 92  1 46 51
    33  5 88 47 19
     0 35  2 69 72
    67 56 49 20 63
    25  7 41 65 91
    
    17 69 67 77 23
    16 79 81 51 57
    12 59 49 76 91
     1 55 41 87 38
    85 98 37 71  5
    
    90 11 18 59 31
    61  1 28  2 27
    98 56 95 63 93
    24 83 36 85 72
    64 97 69 20 10
    
    80 58 95  5 74
     6 20 13 59 63
     8 62 55 53 41
    48 70 28 10 47
    18  4 76 45 34
    
    39 30 64 24 14
    42  6  0 33 57
    35  7 68 62 32
    70 65 44 82 31
    98 93 50 53 61
    
    14  9 98 70 45
    27 86  6 21 76
    56 19 26 28 43
    78 87 58 89 97
    72 49 54 67  8
    
    21 22 51 62 59
    38 64 30 40 94
    56 57 28 19 17
    50 32 83 97 48
    41 54 75 66  5
    
     4 21 16 91 75
    17 87 68 38 66
    92 11 39 31 45
    58 41 96 85 98
    99 44 86 15 26
    
    76 61 82 96 49
    98 10 93 22 56
    66 78 21 73 67
     3 39 15 85 87
    48 91 45 70 53
    
    17  6  8 46 30
    81 53 76 21 63
    20 47 75 67 59
    69 58  5 62 92
     7  9 93 43 70
    
    17 50 24 71 28
    30 31 37 48 80
    34 62 19 57 41
    88 49 51 93 98
    87 78 55 94 46
    
    93 87 54 64 29
    81 66 35 43 25
    74 86 95  2 92
    42 94 45 51 17
    23 28 16 37 80
    
    68 15 25 10 32
    60 51 45 38  4
    64 47 50 12 14
    86 61 31 67  2
    18 28 55 59 87
    
    95 84 19 48  0
    12 22 97  6 89
    93 70 71 35 88
    49 18 37 58 36
    43 63 23 68 17
    
    29 15 91 37 45
     3 98 33 73 39
    31 13 94 90 96
    81 87 78 93 42
    69 75 14  2 27
    
    80 30 69 34  1
    59 23 20 85 31
    48 71 16 96 92
    66 99 39 53 52
    91 67 70 77 19
    
    90 16 52 74  2
    41 39 95 59  1
    46 84 64 93 14
    92 48 25 28 98
    94 81 20 27 32
    
    22 89 48 77 37
    54 59 30 71 38
    80 53  3 27 32
    25 23 35 79 91
    15 29  7 93  9
    
    60 38 37  5 96
    51 77 28 63 80
    45 67 87 20 34
    56 26 61 85 82
    19 71 27 41 54
    
    27 71 18 16 40
    88  3 61 74 52
    80 44 34 10 36
    15  2  1  4 11
    84 50 72 39 89
    
    42 74 45  1 35
     0 63 38 12 85
    18  2 13 87 30
    44 67 68 41 70
    47 82 98 48 69
    
    34 78 38 27  9
    91 47 69 51 73
    67 59 45 15 21
    30 24 89  5  2
    36 22 87 68 76
    
    18 68 58 95 29
    72 24 70 47 79
    35 63 20 71 93
    60 59 34 49 81
    22 98 57 53 76
    
    46 40 82 45  0
     2 22 28 38 97
    11 16 78 95 86
    80 85 83 17 67
    63  1 26 25 64
    
    49 81 31  9 60
    33 15 29 38 66
    90 43  2 39 89
    24 40 63 36 91
    45 68 62 87 12
    
    36 54 76 33  9
    60  7 25 96 61
    17  4  1 62 31
    93 83 79 30 73
    88 75 13  6 24
    
    47 96  5 82 34
    76 67 30 15  2
    52 43 16 92 77
    58 13 18 78 84
    39 41 74 46 91
    
    15 45 99 42  5
    41 61 58 14 55
    24 76 46 91 78
    52 56 81 92 59
     4  0 63 95 29
    
    75 53  8 76 33
    82 60  7 32 97
    90 40 56 51  1
    15 48  4 41 71
    13 69 46 65 52
    
    77 93 27 42 20
     0 68 31 51 52
     3 83 56  4 38
    54 65 86 72 16
    35 34  2 99 64
    
     0 47 54 49 73
    11 61 18 69 16
    75 90  3 65 93
    22 57 84 96  8
    92  4  5  2 35
    
    91 23 41 85 88
    68 28  9 70 74
    51 71 42 79  7
    61 77 57 82 18
    16  4 32 80 38
    
    99 87 92 63 24
    51 64 22  9 94
    48  5  7 83 19
    11 27 46  2 17
    33 60 36 30 32
    
    91 20 80 10 81
    55 78  8 67  7
    37 76 31 16 49
    30 33 63 68 28
    50 35 40 74 77
    
    27 39 23 34 94
    51 18 60  8 98
    28 75  4 85 12
    96  2 15 29 88
    46 35 32 79 50
    
    91 62  4 40 11
    92 47 56  5  3
    85 75 55  8 12
    25 48 13 31 21
    46 54 95 26 80
    
     5 54 87 34  3
    96 12 67  6 14
     1 43 92 35 49
    31 72 65 85  2
    75 81 26 28  4
    
    81 38  3 64 71
    69 53 19  1 67
    17 63 73 10 85
    37 15 91 20 62
     0 35 47  8 43`;
    
    execute(input);
}