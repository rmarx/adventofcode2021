
{
    class Pair {
        public left:  number | Pair | undefined;
        public right: number | Pair | undefined;

        public parent:Pair|undefined = undefined;

        constructor(){
            this.left = undefined;
            this.right = undefined;
        }

        public toString():string {
            return "[" + this.left + "," + this.right + "]";
        }
    }



    function execute(input:string) {
    
        input = `[[[[4,3],4],4],[7,[[8,4],9]]]
        [1,1]`;

        // input = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
        // [[[5,[2,8]],4],[5,[[9,9],0]]]
        // [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
        // [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
        // [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
        // [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
        // [[[[5,4],[7,7]],8],[[8,3],8]]
        // [[9,3],[[9,9],[6,[4,9]]]]
        // [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
        // [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

        // input = `[[[[[9,8],1],2],3],4]`;
        // input = `[7,[6,[5,[4,[3,2]]]]]`;
        input = `[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]`;


        const inputs = input.split("\n").map( (str) => str.trim() );

        const numbers:Array<Pair> = new Array<Pair>();


        for ( let line of inputs ) {
            const chars = line.split("");
            chars.shift(); // remove first [ so we can start with a non-undefined parent
            
            let currentParent:Pair = new Pair();

            for ( let char of chars ) {
                if ( char === "[" ) {
                    let newPair = new Pair();
                    newPair.parent = currentParent;

                    if ( currentParent.left === undefined ) {
                        currentParent.left = newPair;
                    }
                    else {
                        currentParent.right = newPair;
                    }

                    currentParent = newPair;
                }
                else if ( char === "," ) {
                    // we can just skip this
                }
                else if( char === "]" ) {
                    if( currentParent.parent !== undefined ) // should only happen at the end of the parsing
                        currentParent = currentParent!.parent;
                }
                else {
                    const nr:number = parseInt( char ); // assumption: numbers are always 0 to 9
                    if ( currentParent!.left === undefined ) {
                        currentParent!.left = nr;
                    }
                    else {
                        currentParent!.right = nr;
                    }
                }
            }

            numbers.push( currentParent! );
        }

        // let testStringifications = "";
        // for ( let nrs of numbers ) {
        //     testStringifications += nrs.toString() + "\n";
        // }

        // if ( testStringifications !== (inputs.join("\n") + "\n") ) {
        //     console.log(testStringifications);
            
        //     for ( let nrsIndex = 0; nrsIndex < numbers.length; ++nrsIndex ) {
        //         console.log( numbers[nrsIndex].toString() );
        //         console.log( inputs[nrsIndex] );
        //         console.log( " ");
        //     }
        // }

        console.log( reduce(numbers[0]) );

        return execute1(numbers);
        // return execute2(input);
    }
    
    function reduce( number:Pair ) {

        function explode( number:Pair ):boolean {

            // we need to find the leftmost child at depth 4 basically
            let nodesToCheck:Array<Pair> = new Array<Pair>();
            nodesToCheck.push( number );

            let currentDepth:number = 0;

            while( nodesToCheck.length > 0 ) {
                let currentNode:Pair = nodesToCheck.pop()!;
                ++currentDepth;
                
                if ( currentDepth === 5 ){
                    // pair found! need to reduce
                    console.log("pair @ 4 found", currentNode.toString() );
                    return true;
                }
                else {
                    let pairsAdded = 2;

                    (currentNode.right instanceof Pair ) ? nodesToCheck.push( currentNode.right ) : --pairsAdded ;
                    (currentNode.left instanceof Pair )  ? nodesToCheck.push( currentNode.left )  : --pairsAdded ;

                    if ( pairsAdded == 0 ) {
                        --currentDepth; // TODO: FIXME: this needs to change. Example [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] of the assignment doesn't work with this
                        // maybe add depth as part of the stack entry? would be the easiest solution...
                    }
                    else {
                        console.log("Current state", nodesToCheck);
                    }
                }
            }

            return false;
        }

        function split ( number:Pair ):boolean {
            return false;
        }

        let done:boolean = false;
        while( !done ) {
            let exploded = explode( number );
            done = true; // TODO: REMOVE: FIXME!
            if( !exploded ){
                let wasSplit = split( number );
                if ( !wasSplit ) {
                    done = true;
                }
            }
        }

    }

    function execute1(numbers:Array<Pair>):void {
 
        // let currentNumber:Pair = numbers[0];
        // for ( let nr = 1; nr < numbers.length; ++nr ) {
        //     let sum = new Pair();
        //     sum.left = currentNumber;
        //     sum.right = numbers[nr];

        //     reduce( sum );

        //     currentNumber = sum;
        // }
    }
    
    function execute2(inputs:Array<string>):void {
    
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