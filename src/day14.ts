
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

        interface ResultCounts {
            results:Map<string, number> // for a given character (e.g., C), stores how many of that character were present in the output
        }

        // for a given pair (e.g., NN), stores the outcome after 10 rounds of substitution
        const polymerCache:Map<string, Array<string>> = new Map<string, Array<string>>();
        const countCache:Map<string, ResultCounts> = new Map<string, ResultCounts>();

        // will calculate a number of substitutions of the start string
        // the idea is that you pass a single pair (e.g., CN, FF) and it will calculate the polymer outcome for that pair inputs
        const extendPolymer = function( polymer:string[], substitutions:Map<string, string>, iterations:number ):string[] {

            const polymerKey = polymer.join("") + "@" + iterations;

            if ( polymerCache.has(polymerKey) ) {
                return polymerCache.get(polymerKey)!;
            }

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

            // console.log(step + "/" + bigSteps + ":getScoreForPolymer", polymer );

            const polymerKey = polymer.join("") + "@" + step; 

            // we build a countCache entry for each step, not just the final step
            // so check it for each invocation
            if ( countCache.has( polymerKey ) ) {
                return countCache.get( polymerKey )!;
            }

            if ( step == bigSteps + 1 ) { // final depth, calculate actual occurrences

                const output:ResultCounts = { results: new Map<string, number>() };

                const individualCharacters = new Set( polymer );
                for( let char of individualCharacters ) {
                    output.results.set( char, polymer.filter( (pchar) => pchar === char ).length );
                }

                countCache.set( polymerKey, output );

                return output;
            }
            else {
                // ASSUMPTION: The polymer we're passed in is always of length 2!
                const extendedPolymer = extendPolymer( polymer, substitutions, cacheLineSize );

                let occurrences:ResultCounts = { results: new Map<string, number>() };
                for( let charIndex = 0; charIndex < extendedPolymer.length - 1; ++charIndex ) {
                    mergeCounts( occurrences, getScoreForPolymer( [extendedPolymer[charIndex], extendedPolymer[charIndex + 1]] , step + 1) );
                }

                // we've now counted some letters double, because they are re-used in the polymer extensions
                // so we need to remove the doubles for everything that's not either start or end letter
                for ( let c = 1; c < extendedPolymer.length - 1; ++c ) {
                    occurrences.results.set( extendedPolymer[c], occurrences.results.get( extendedPolymer[c] )! - 1 );
                }

                countCache.set( polymerKey, occurrences );

                return occurrences;
            }

        }

        // getScoreForPolymer expects to get a single pair of letters as polymer, so split the input here
        const results:ResultCounts = { results: new Map<string, number>() };
        for( let charIndex = 0; charIndex < polymer.length - 1; ++charIndex ) {
            mergeCounts( results, getScoreForPolymer( [ polymer[charIndex], polymer[charIndex + 1]], 1 ));
        }

        // need to remove double counted chars
        for ( let charIndex = 1; charIndex < polymer.length - 1; ++charIndex ) {
            if ( results.results.has( polymer[charIndex] ) ) {
                results.results.set( polymer[charIndex], results.results.get( polymer[charIndex] )! - 1 );
            }
        }

        let maxCount = Number.MIN_SAFE_INTEGER;
        let minCount = Number.MAX_SAFE_INTEGER;

        console.log( results );

        for( let char of results.results.keys() ) {
            const count = results.results.get(char)!;

            if ( count > maxCount ) {
                maxCount = count;
            }
            if ( count < minCount ) {
                minCount = count;
            }
        }

        console.log( "Final score:", maxCount - minCount, (maxCount - minCount) === 3816397135460  ); // should be 3816397135460
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