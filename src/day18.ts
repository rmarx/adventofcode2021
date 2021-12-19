
{
    type SnailNumber = Array<string|number>;

    function execute(input:string) {
        const inputs = input.split("\n").map( (str) => str.trim() );

        const snailnumbers:Array<SnailNumber> = new Array<SnailNumber>();

        for ( let line of inputs ) {
            const chars:SnailNumber = line.split("");
            
            for ( let [idx, char] of chars.entries() ) {
                if ( char !== "[" && char !== "]" && char !== "," ) {
                    chars[idx] = parseInt("" + char);
                }
            }

            snailnumbers.push( chars );
        }

        // return execute1(snailnumbers);
        return execute2(snailnumbers);
    }

    function reduce(input:SnailNumber) {

        function explode(input:SnailNumber):boolean {

            // If any pair is nested inside four pairs, the leftmost such pair explodes
            // inside 4 pairs = from the fifth [ onward
            let depth = 0;
            for ( let [idx,char] of input.entries() ) {
                if ( char === "[" )
                    ++depth;
                else if( char === "]" )
                    --depth;
                    
                if ( depth === 5 ) {
                    // sanity check for [x,y]
                    if ( !( Number.isInteger(input[idx + 1]) || (input[idx + 2] != ",") || !(Number.isInteger(input[idx + 3])) )) {
                        console.error("explosion for non-regular number pair!", input);
                        return true;
                    }

                    /* To explode a pair, the pair's left value is added to the first regular number to the left of the exploding pair (if any), 
                    and the pair's right value is added to the first regular number to the right of the exploding pair (if any). 
                    */
                    let leftNr:number  = input[idx + 1] as number;
                    let rightNr:number = input[idx + 3] as number;

                    for ( let leftIdx = idx - 1; leftIdx >= 0; --leftIdx ) {
                        if ( Number.isInteger(input[leftIdx]) ) {
                            (input[leftIdx] as number) += leftNr;
                            break;
                        }
                    }
                    
                    for ( let rightIdx = idx + 4; rightIdx < input.length; ++rightIdx ) {
                        if ( Number.isInteger(input[rightIdx]) ) {
                            (input[rightIdx] as number) += rightNr;
                            break;
                        }
                    }

                    // Then, the entire exploding pair is replaced with the regular number 0.
                    // idx = [, so idx + 4 is ], so we need to slice out 4 characters and replace one with 0
                    input.splice( idx, 4 );
                    input[idx] = 0;

                    return true;
                }
            }

            return false;
        }

        function split(input:SnailNumber):boolean {
            // If any regular number is 10 or greater, the leftmost such regular number splits.
            for ( let [idx,char] of input.entries() ) {

                if ( Number.isInteger(char) && char >= 10 ) { 

                    // To split a regular number, replace it with a pair; the left element of the pair should be the regular number divided by two and rounded down, 
                    // while the right element of the pair should be the regular number divided by two and rounded up.
        
                    const left  = Math.floor( char as number / 2);
                    const right = Math.ceil(  char as number / 2);

                    // idx is currently the number
                    // we want to replace it with [left, right], which are 5 entries in total
                    // so: replace idx with [, add 4 more
                    input[idx] = "[";
                    input.splice(idx + 1, 0, ...[left as unknown as string, ",", right as unknown as string, "]"]);

                    return true;
                }
            }

            return false;
       }

        let done:boolean = false;
        while( !done ) {
            let exploded:boolean = explode( input );
            if( !exploded ){
                let wasSplit = split( input );
                if ( !wasSplit ) {
                    done = true;
                }
            }
        }

        return input;
    }

    function add( nr1:SnailNumber, nr2:SnailNumber ) {
        let output = new Array<string|number>();

        output.push("[");
        output.push( ...nr1 );
        output.push(",");
        output.push( ...nr2 );
        output.push("]");

        return output;
    }

    function magnitude( input:SnailNumber ):number {
        // The magnitude of a pair is 3 times the magnitude of its left element plus 2 times the magnitude of its right element. 
        // The magnitude of a regular number is just that number.

        // we use the same logic as for explode: look for the inner pairs [x,y] and calculate those first and replace them with their magnitude
        // keep doing this iteratively until we get a single number
        while( input.length >= 5 ) { // 5 because [x,y] is 5
            for ( let [idx,char] of input.entries() ) {
                if ( char === "[" && ( Number.isInteger(input[idx + 1]) && (input[idx + 2] == ",") && (Number.isInteger(input[idx + 3])) )) {
                    let magnitude = (input[idx + 1] as number * 3) + (input[idx + 3] as number * 2);    

                    // idx is currently the [, which we replace
                    // we then want to delete the following 4 entries
                    input.splice( idx, 4 );
                    input[idx] = magnitude;
                }
            }
        }

        return input[0] as number;
    }

    function execute1(inputs:Array<SnailNumber>):void {

        let currentNumber:SnailNumber = inputs[0];
        for ( let nr = 1; nr < inputs.length; ++nr ) {
            let sum = add( currentNumber, inputs[nr] );

            reduce( sum );

            currentNumber = sum;
        }

        console.log( currentNumber.join("") );
        console.log("Magnitude of final sum:", magnitude(currentNumber) ) ; // should be 4057
    }
    
    function execute2(inputs:Array<SnailNumber>):void {
    
        let maxMagnitude = Number.MIN_SAFE_INTEGER;

        for ( let nr of inputs ) {

            for ( let nr2 of inputs ) {
                 if ( nr === nr2 ) {
                     continue;
                 }

                 // need to make sure we make copies of the numbers with slice() because our operations are destructive
                 let sum = add(nr.slice(0), nr2.slice(0));
                 reduce( sum );

                 const mag = magnitude(sum);
                 if ( mag > maxMagnitude ) {
                     maxMagnitude = mag;
                 }
            }
        }

        console.log("Max magnitude", maxMagnitude); // should be 4683
    }
    
    
    
    const input = `[[[7,1],2],3]
    [[1,7],7]
    [[6,8],[[6,[3,6]],[0,5]]]
    [[[[2,1],8],[[9,4],8]],[[6,5],4]]
    [[1,[[3,8],[9,1]]],[[9,1],[[1,7],0]]]
    [[[7,4],[8,[7,6]]],[9,[[6,3],[7,8]]]]
    [[[[5,0],1],4],[[5,[6,9]],[[4,3],2]]]
    [[[3,8],8],[[[3,2],8],[9,[0,5]]]]
    [[[[5,8],[3,9]],[7,[1,4]]],[6,1]]
    [3,[[[3,3],9],[0,7]]]
    [[[6,9],1],[[0,[8,4]],[[2,2],9]]]
    [[[[6,2],3],[0,4]],3]
    [[[[3,8],7],[[7,4],0]],[2,[5,[2,8]]]]
    [[4,[9,[8,0]]],[[1,5],[[9,3],8]]]
    [[[8,5],[3,[1,4]]],[[6,[8,0]],[[2,7],[2,6]]]]
    [4,7]
    [[[[2,3],0],[[1,9],[4,1]]],[[1,[4,2]],3]]
    [[[8,[5,3]],[[5,7],7]],[[5,6],[6,4]]]
    [[[[2,4],1],[8,6]],[[6,5],[0,[9,1]]]]
    [[[1,[5,7]],8],[[[9,1],9],[[1,2],4]]]
    [[[[5,5],[4,0]],[4,[9,6]]],[[[2,1],1],7]]
    [[[[1,9],[9,5]],[[5,0],[3,1]]],[[[6,7],[8,8]],[[7,3],0]]]
    [[6,[[6,7],[9,0]]],[[7,7],[[0,3],0]]]
    [[0,6],[5,2]]
    [[[[5,8],3],[[9,0],8]],[7,4]]
    [[0,[[9,9],[9,4]]],[[[1,1],2],[1,[6,7]]]]
    [0,[[5,7],2]]
    [[2,[[5,4],6]],[1,[8,[7,6]]]]
    [[[1,7],[8,[5,8]]],[[[2,1],[9,1]],[[5,6],9]]]
    [[1,8],[9,[4,3]]]
    [5,[2,[[5,5],9]]]
    [3,[8,[[2,8],[4,8]]]]
    [[[4,9],[[5,5],0]],[9,[8,[3,0]]]]
    [[[2,[6,4]],[8,[9,9]]],[[[0,4],8],[3,[9,7]]]]
    [[[[8,1],[2,4]],3],[1,[[3,3],[6,3]]]]
    [[[8,[7,3]],[1,8]],2]
    [[8,[8,4]],[[6,[4,7]],[3,0]]]
    [[[[4,6],[8,3]],9],[9,[[8,9],[0,9]]]]
    [[3,[[2,7],[4,4]]],2]
    [8,[[[8,6],2],[[8,9],6]]]
    [[[[5,7],[2,0]],[[0,2],[5,5]]],[[[8,5],5],[[1,3],[2,3]]]]
    [[1,6],[[9,8],[9,[4,9]]]]
    [[[[1,4],5],9],[4,[6,8]]]
    [[[[6,4],[9,0]],[[1,4],[6,6]]],[[9,[2,8]],2]]
    [[[[5,9],2],[[0,0],5]],[2,1]]
    [6,[[3,2],[[3,0],0]]]
    [[[[7,4],1],[[4,1],1]],[[3,4],4]]
    [3,[9,[9,7]]]
    [[[3,[3,3]],[0,3]],[1,[1,8]]]
    [[8,[8,7]],[[9,2],5]]
    [[[1,[3,9]],[5,9]],[1,5]]
    [[[[7,8],[9,7]],9],[[[9,2],[2,2]],[[9,6],8]]]
    [4,[[3,5],[[1,3],[5,5]]]]
    [7,[[[0,1],2],[[3,6],5]]]
    [0,[[[2,4],[3,4]],[8,9]]]
    [[1,[[6,8],1]],[8,0]]
    [1,1]
    [7,0]
    [[1,2],[[0,[8,3]],[[4,5],[9,7]]]]
    [[[[2,3],[5,9]],[7,[1,9]]],2]
    [[3,5],[[9,7],9]]
    [[[[6,9],[4,8]],6],0]
    [[[[2,4],[3,9]],[2,[9,4]]],[[[8,9],[3,1]],7]]
    [[5,[[0,2],4]],[[[9,9],[7,4]],[1,5]]]
    [3,[6,[[5,4],1]]]
    [[[2,[2,7]],2],[[4,[7,3]],5]]
    [7,[[0,[2,0]],[[9,4],6]]]
    [[4,[3,[6,2]]],9]
    [[[0,[5,6]],[8,3]],[[7,9],[0,[9,6]]]]
    [8,[[6,4],[4,8]]]
    [[[8,[6,8]],[5,[7,3]]],[[[7,8],5],2]]
    [[[[3,5],[4,7]],5],[[0,0],[9,[1,9]]]]
    [[7,[[1,5],9]],[[[3,4],[1,7]],[1,[7,9]]]]
    [[0,[3,[4,1]]],[[[2,9],3],[4,[0,8]]]]
    [[[8,[1,6]],[[0,1],7]],[[[1,1],[0,2]],[[9,4],[9,6]]]]
    [[[[6,7],0],[[6,8],9]],[[1,[6,6]],[[2,9],[4,7]]]]
    [[[[5,0],[1,2]],[1,[5,1]]],[[0,4],1]]
    [[9,1],6]
    [[7,2],[[[5,5],[4,3]],6]]
    [[9,[[0,6],9]],[[7,9],[7,1]]]
    [[[[7,3],[6,4]],[[2,5],[7,2]]],[[[4,4],0],[[9,5],[8,5]]]]
    [[[[8,8],[6,4]],[[0,2],[9,5]]],2]
    [[[[3,0],7],[9,2]],[[0,[8,6]],[[7,2],[8,5]]]]
    [[0,6],[1,[9,[4,3]]]]
    [[0,8],[[[5,0],6],[5,[2,0]]]]
    [[[[7,1],[0,3]],[[9,9],[3,5]]],[4,[8,4]]]
    [7,[[1,[3,7]],[[3,4],[2,3]]]]
    [[[[2,2],[4,8]],[[3,4],0]],[[[1,5],[2,8]],5]]
    [6,[[[9,1],5],[9,9]]]
    [[[2,[8,6]],[[9,9],[6,3]]],4]
    [[[[3,2],[9,3]],8],9]
    [[[[6,9],0],[[0,6],[1,3]]],[[5,[9,8]],[[1,5],[3,7]]]]
    [[2,[4,[2,3]]],[[[6,0],[7,2]],3]]
    [[[[8,3],4],[6,[8,8]]],4]
    [[[9,8],5],[[[4,4],[6,3]],[8,6]]]
    [9,2]
    [[[3,4],[4,[7,0]]],[0,[4,[6,9]]]]
    [[[0,8],[3,9]],[[[3,8],6],[[9,3],6]]]
    [[[[5,6],[0,3]],1],[8,[2,9]]]
    [[[[4,2],8],[[9,3],7]],0]`;
    
    execute(input);
}