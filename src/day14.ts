
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

        return execute1(template, substitutions);
        // return execute2(input);
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
    
    function execute2(template:string, substitutions:Map<string, string>):void {
    
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