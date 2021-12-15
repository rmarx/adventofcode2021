
{
    function execute(input:string) {
    
        // input = `NNCB

        // CH -> B
        // HH -> N
        // CB -> H
        // NH -> C
        // HB -> C
        // HC -> B
        // HN -> C
        // NN -> C
        // BH -> H
        // NC -> B
        // NB -> B
        // BN -> B
        // BB -> N
        // BC -> B
        // CC -> N
        // CN -> C`;

        const inputs = input.split("\n").map( (str) => str.trim() );

        const template:string[] = inputs[0].split("");

        const substitutions:Map<string, string> = new Map<string, string>();

        for ( let i = 2; i < inputs.length; ++i ) {
            const parts = inputs[i].split(" -> ");
            
            substitutions.set( parts[0], parts[1] );
        }

        // return execute1(template, substitutions);
        return execute2(template, substitutions);
    }
    
    function execute1(polymer:string[], substitutions:Map<string, string>):void {
 
        const stepCount = 10;

        for ( let step = 0; step < stepCount; ++step ) {

            // assumption: we always add 1 char in between 2 others
            // so never add more than 1, never need to read more than 2 characters to determine
            for( let charIndex = 0; charIndex < polymer.length - 1; ++charIndex ) {
                const pair = "" + polymer[charIndex] + polymer[charIndex + 1];
                const substitution = substitutions.get( pair );

                if ( substitution !== undefined ) {
                    // const oringinalPolymer = polymer.join("");

                    polymer.splice( charIndex + 1, 0, substitution );
                    charIndex += 1; // skip the newly inserted one manually

                    // console.log( oringinalPolymer, " -> ", pair, substitution, " = ", polymer.join("") )
                }
            }

            // console.log( step + 1, polymer.join("") );
        }

        const individualCharacters = new Set( polymer );

        let maxCount = Number.MIN_SAFE_INTEGER;
        let minCount = Number.MAX_SAFE_INTEGER;

        for( let char of individualCharacters ) {
            // this is PROBABLY not the most performant... but we'll see
            const count = polymer.filter( (pchar) => pchar === char ).length;

            if ( count > maxCount ) {
                maxCount = count;
            }
            if ( count < minCount ) {
                minCount = count;
            }
        }

        console.log("Result: ", maxCount - minCount ); // should be 2584
    }
    
    function execute2(polymer:string[], substitutions:Map<string, string>):void {

        // well... now we're f*cked... need to use memoization again to be able to calculate this
        // however, things are more difficult than for day 6, since we have overlapping characters at the edges that we shouldn't count twice...

        interface ResultCounts {
            results:Map<string, number> // for a given character (e.g., C), stores how many of that character were present in the output
        }

        // for a given pair (e.g., NN), stores the outcome after 10 rounds of substitution
        const polymerCache:Map<string, Array<string>> = new Map<string, Array<string>>();
        const countCache:Map<string, ResultCounts> = new Map<string, ResultCounts>();

        // will calculate a number of substitutions of the start string
        // the idea is that you pass a single pair (e.g., CN, FF) and it will calculate the polymer outcome for that pair inputs
        const iteratePolymer = function( polymer:string[], substitutions:Map<string, string>, iterations:number ):string[] {

            const polymerKey = polymer.join("") + "@" + iterations;

            // this is probably not needed
            if ( polymerCache.has(polymerKey) ) {
                return polymerCache.get(polymerKey)!;
            }
            
            console.log("iteratePolymer", polymer);

            for ( let step = 0; step < iterations; ++step ) {

                for( let charIndex = 0; charIndex < polymer.length - 1; ++charIndex ) {
                    const pair = "" + polymer[charIndex] + polymer[charIndex + 1];
                    const substitution = substitutions.get( pair );
    
                    if ( substitution !== undefined ) {
    
                        polymer.splice( charIndex + 1, 0, substitution );
                        charIndex += 1; // skip the newly inserted one manually
                    }
                }
            }

            polymerCache.set( polymerKey, polymer );

            return polymer;
        }


        const cacheLineSize = 10; // 10
        const totalDepth = 40; // 40
        const bigSteps = totalDepth / cacheLineSize; // 4

        const mergeCounts = function( count1:ResultCounts, count2:ResultCounts ) {
            for ( let key of count1.results.keys() ) {
                if ( count2.results.has(key) ) {
                    count1.results.set( key, count1.results.get(key)! + count2.results.get(key)! );
                }
            }

            // keys in 2 that weren't in 1
            for ( let key of count2.results.keys() ) {
                if ( !count1.results.has(key) ) {
                    count1.results.set(key, count2.results.get(key)! );
                }
            }
        }

        const getScoreForPolymer = function( polymer:string[], step:number ):ResultCounts {

            // given a polymer, we want to extend it 40 steps and calculate the occurrences of each letter
            // doing 40 steps at once is too slow, so we do this recursively in steps of 10
            // - extend polymer 10 steps
            //      - take the first pair of letters of the extended polymer and extend those 10 steps
            //      - take the first pair of this new extension and extend 10 steps again
            //      - do this again one final time
            //           - we can now calculate the letter occurrences for a small part of the final polymer: store those, we can discard the extended polymer
            //      - now take the next letter-pair of the 30-deep extension, extend 10 steps, and calculate occurrences
            //      - keep doing this until the first 30-deep extension is done. Accumulate occurrences across them and store that
            //          - return from the recursion and go for the next 2-letter pair at 20-deep etc. 
            //      -> We make this faster by caching both the polymer-extensions at 10-deep, as well as scores at 40, 30, 20 and 10 deep


            // console.log(step + "/" + bigSteps + ":getScoreForPolymer", polymer );

            const polymerKey = polymer.join("") + "@" + step; 

            if ( countCache.has( polymerKey ) ) {
                return countCache.get( polymerKey )!;
            }

            if ( step == bigSteps + 1 ) { // step 5
                const individualCharacters = new Set( polymer );

                const output:ResultCounts = { results: new Map<string, number>() };

                for( let char of individualCharacters ) {
                    // this is PROBABLY not the most performant... but we'll see
                    output.results.set( char, polymer.filter( (pchar) => pchar === char ).length );
                }

                countCache.set( polymerKey, output );

                // console.log("CHARACTERS FROM POLYMER", polymer, individualCharacters, output);

                return output;
            }
            else {

                // step 1: will extend to 10 steps and call recursion for step 2
                // step 2: will extend to 20 steps and call recursion for step 3
                // step 3: will extend to 30 steps and call recursion for step 4
                // step 4: will extend to 40 steps and call recursion for step 5
                //      step 5: this is where we calculate the actual scores for the final extended polymer, see above

                let output:ResultCounts = { results: new Map<string, number>() };

                for( let charIndex = 0; charIndex < polymer.length - 1; ++charIndex ) { // TODO: this shouldn't be needed besides the top-level call, as for the rest we only call this function with polymers of length 2
                    const pair = "" + polymer[charIndex] + polymer[charIndex + 1];
                
                    const extendedPolymer = iteratePolymer( [ polymer[charIndex], polymer[charIndex + 1] ], substitutions, cacheLineSize );

                    // console.log( pair + " extended into " + extendedPolymer );
                    
                    for( let extendedCharIndex = 0; extendedCharIndex < extendedPolymer.length - 1; ++extendedCharIndex ) {
                        // console.log( output );
                        mergeCounts( output, getScoreForPolymer( [extendedPolymer[extendedCharIndex], extendedPolymer[extendedCharIndex + 1]] , step + 1) );
                    }

                    // we've now counted some letter double, because they are re-used in the polymer extensions
                    // so we need to remove the doubles for everything that's not either start or end letter
                    for ( let c = 1; c < extendedPolymer.length - 1; ++c ) {
                        output.results.set( extendedPolymer[c], output.results.get( extendedPolymer[c] )! - 1 );
                    }
                }

                // console.log("SET COUNTCACHE", polymerKey, output);
                countCache.set( polymerKey, output );

                return output;
            }

        }

        const results:ResultCounts = getScoreForPolymer( polymer, 1 ); // step 1 = 10, 2 = 20, 3 = 30 and 4 = 40

        console.log( results );

        // need to handle duplicates due to overlapping starting pairs
        // in the end, it turns out that with our method, we'll just have some off-by-ones for the characters in the middle of the input polymer string
        // NNCB
        // After step 10, 
        // B occurs 1749 times,   1749     // exact, even though in the initial polymer (is at the back though, isn't taken later)
        // C occurs 298 times,     299      // off by one, once in initial
        // H occurs 161 times, and  161    // exact
        // N occurs 865 times       866    // off by one, even though it's in the initial twice (it's at the start though)
        // so let's just filter the unnecessary ones out

        for ( let charIndex = 1; charIndex < polymer.length - 1; ++charIndex ) {
            if ( results.results.has( polymer[charIndex] ) ) {
                results.results.set( polymer[charIndex], results.results.get( polymer[charIndex] )! - 1 );
            }
        }

        let maxCount = Number.MIN_SAFE_INTEGER;
        let minCount = Number.MAX_SAFE_INTEGER;

        console.log( results );
        /* 
            should be:
            'P' => 2123534739569,
            'K' => 1873105930252,
            'C' => 2646198121264,
            'B' => 1574027242624,
            'F' => 3423703277376,
            'N' => 1872052600109,
            'S' => 1772658891477,
            'H' => 4290780551024,
            'V' => 840276158486,
            'O' => 474383415564
        */

        for( let char of results.results.keys() ) {
            const count = results.results.get(char)!;

            if ( count > maxCount ) {
                maxCount = count;
            }
            if ( count < minCount ) {
                minCount = count;
            }
        }

        console.log( "Final score:", maxCount - minCount ); // should be 3816397135460
    }
    
    
    
    const input = `PSVVKKCNBPNBBHNSFKBO

    CF -> H
    PP -> H
    SP -> V
    NO -> C
    SF -> F
    FS -> H
    OF -> P
    PN -> B
    SH -> V
    BO -> K
    ON -> V
    VP -> S
    HN -> B
    PS -> P
    FV -> H
    NC -> N
    FN -> S
    PF -> F
    BF -> F
    NB -> O
    HS -> C
    SC -> V
    PC -> K
    KF -> K
    HC -> C
    OK -> H
    KS -> P
    VF -> C
    NV -> S
    KK -> F
    HV -> H
    SV -> V
    KC -> N
    HF -> P
    SN -> F
    VS -> P
    VN -> F
    VH -> C
    OB -> K
    VV -> O
    VC -> O
    KP -> V
    OP -> C
    HO -> S
    NP -> K
    HB -> C
    CS -> S
    OO -> S
    CV -> K
    BS -> F
    BH -> P
    HP -> P
    PK -> B
    BB -> H
    PV -> N
    VO -> P
    SS -> B
    CC -> F
    BC -> V
    FF -> S
    HK -> V
    OH -> N
    BV -> C
    CP -> F
    KN -> K
    NN -> S
    FB -> F
    PH -> O
    FH -> N
    FK -> P
    CK -> V
    CN -> S
    BP -> K
    CH -> F
    FP -> K
    HH -> N
    NF -> C
    VB -> B
    FO -> N
    PB -> C
    KH -> K
    PO -> K
    OV -> F
    NH -> H
    KV -> B
    OS -> K
    OC -> K
    FC -> H
    SO -> H
    KO -> P
    NS -> F
    CB -> C
    CO -> F
    KB -> V
    BK -> K
    NK -> O
    SK -> C
    SB -> B
    VK -> O
    BN -> H`;
    
    execute(input);
}