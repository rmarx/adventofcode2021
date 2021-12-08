
{
    function execute(input:string) {
    
        // input = `3,4,3,1,2`;

        const inputs = input.split(",").map( str => parseInt(str) );

        // return execute1(inputs);
        return execute2(inputs);
    }
    
    function execute1(inputs:Array<number>):void {
 
        // I can think of several ways to do this
        // simplest for part 1 is probably go through iteratively and update each number as you go along, adding where needed
        // however, I want to experiment a bit with dynamic programming/memoization and thought of an approach for that here

        // general idea is to calculate the 10-day progression for each number 0 - 8 and store that in a memoized structure (a cache, basically)
        // then, to simulate 80 days, we simulate 10 days for each number, then 10 days again for the outputs, etc. so we only do 8 iterations instead of 80
        // downside: doesn't really scale to non-multiples of 10, let's hope we don't need those
        // if we do, we can add things in the cache at 1, 2, 3, 4, etc. days as well

        const cache:Map<string, Array<number>> = new Map<string, Array<number>>();
        // they key here will be of the form   start@iterations    so 0@10, 1@10, etc. to be flexible enough to extend to more than just 10-day iterations eventually

        // phase 1: generate initial cache
        for ( const start of [0,1,2,3,4,5,6,7,8] ) {
            
            let currentValues = [start];

            for ( let day = 1; day < 11; ++day ) {
                let newCount = 0;

                for ( let [idx, val] of currentValues.entries() ) {
                    if ( currentValues[idx] == 0 ) {
                        currentValues[idx] = 6;
                        newCount++;
                    }
                    else {
                        currentValues[idx] = val - 1;
                    }
                }

                for ( let i = 0; i < newCount; ++i ) {
                    currentValues.push( 8 );
                }

                // if ( start == 4 ) {
                //     console.log( start, currentValues );
                // }
            }

            cache.set( start + "@" + 10, currentValues );
        }

        // 80 days = 8 iterations of 10 days
        let outcomes = inputs;
        for( let iteration = 0; iteration < 8; ++iteration ) {
            
            const newOutcomes:number[] = [];

            for ( const input of outcomes ) {
                // console.log("Adding outcomes for", input, cache.get( input + "@" + 10 ));

                newOutcomes.push( ...cache.get( input + "@" + 10 )! );
            }

            // console.log("Result after " + ((iteration + 1) * 10) + " days", newOutcomes.join(",") );

            outcomes = newOutcomes;
        }

        console.log("Result : ", outcomes.length ); // should be 386640

    }
    
    function execute2(inputs:Array<number>):void {
    
        // before we did until 80, now we need 256
        // easy adjustment of our caching logic really, just need to use multiples of 2 in the initial calculation
        // let's go with 64 instead of 10 then

        const cacheLineSize = 64;

        const cache:Map<string, Array<number>> = new Map<string, Array<number>>();

        for ( const start of [0,1,2,3,4,5,6,7,8] ) {
            let currentValues = [start];

            for ( let day = 1; day < cacheLineSize + 1; ++day ) {
                let newCount = 0;

                for ( let [idx, val] of currentValues.entries() ) {
                    if ( currentValues[idx] == 0 ) {
                        currentValues[idx] = 6;
                        newCount++;
                    }
                    else {
                        currentValues[idx] = val - 1;
                    }
                }

                for ( let i = 0; i < newCount; ++i ) {
                    currentValues.push( 8 );
                }
            }

            cache.set( start + "@" + cacheLineSize, currentValues );
        }

        console.log("Cache", cache);

        // we will use a double layer of memoization. Above is for the actual generated numbers, this is for the result counts
        // not mapping from input to actual generated numbers, this is from input to total count at the coarse-grained iterations cached above
        // key is   inputNumber @ inverseIteration (or depth)
        // so    5 @ 0   will contain   the total count for 5 after 256 days
        // while 5 @ 1   will contain the count for 5 after 192 days etc. (it makes sense in the code, I promise ;))
        const resultsCache:Map<string, number> = new Map<string, number>();

        const calculateTotalAmount = function(input:number, iteration:number):number {

            if ( resultsCache.has( input + "@" + iteration ) ) {
                return resultsCache.get( input + "@" + iteration )!;
            }

            const outcomes = [...cache.get( input + "@" + cacheLineSize )!];

            if ( iteration == 256 / cacheLineSize ) {
                return outcomes.length;
            }
            else {
                let result = 0;
                for ( let outcome of outcomes ) {
                    result += calculateTotalAmount( outcome, iteration + 1 );
                }

                resultsCache.set( input + "@" + iteration, result );
                // console.log({resultsCache});

                return result;
            }
        }

        let resultSum = 0;

        for ( const inputNumber of inputs ) {
            resultSum += calculateTotalAmount(inputNumber, 1);
        }

        console.log("Result : ", resultSum ); // should be 1733403626279
    }
    
    
    
    const input = `4,1,1,4,1,1,1,1,1,1,1,1,3,4,1,1,1,3,1,3,1,1,1,1,1,1,1,1,1,3,1,3,1,1,1,5,1,2,1,1,5,3,4,2,1,1,4,1,1,5,1,1,5,5,1,1,5,2,1,4,1,2,1,4,5,4,1,1,1,1,3,1,1,1,4,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,1,2,1,1,1,1,1,1,1,2,4,4,1,1,3,1,3,2,4,3,1,1,1,1,1,2,1,1,1,1,2,5,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,4,1,5,1,3,1,1,1,1,1,5,1,1,1,3,1,2,1,2,1,3,4,5,1,1,1,1,1,1,5,1,1,1,1,1,1,1,1,3,1,1,3,1,1,4,1,1,1,1,1,2,1,1,1,1,3,2,1,1,1,4,2,1,1,1,4,1,1,2,3,1,4,1,5,1,1,1,2,1,5,3,3,3,1,5,3,1,1,1,1,1,1,1,1,4,5,3,1,1,5,1,1,1,4,1,1,5,1,2,3,4,2,1,5,2,1,2,5,1,1,1,1,4,1,2,1,1,1,2,5,1,1,5,1,1,1,3,2,4,1,3,1,1,2,1,5,1,3,4,4,2,2,1,1,1,1,5,1,5,2`;
    
    execute(input);
}