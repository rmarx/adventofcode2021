
{
    function execute(input:string) {
    
        // input = `16,1,2,0,4,2,7,1,2,14`;

        let inputs = input.split(",").map( (str) => parseInt(str) );

        inputs = inputs.sort(function(a, b){return b-a}); // sort descending, largest first

        // return execute1(inputs);
        return execute2(inputs);
    }
    
    function execute1(inputs:Array<number>):void {
        
        const getCumulativeOffsets = function( referenceValue:number, bestCandidate:number, numbers:number[] ) {

            let sum = 0;
            for ( let i = 0; i < numbers.length; ++i ) {
                sum += Math.abs( numbers[i] - referenceValue );
                // we're looking for the minimal sum, so if we go over the bestCandidate... never good
                if ( sum > bestCandidate ) {
                    return bestCandidate;
                }
            }

            return sum;
        }

        // we have to try each and every possible number. 
        // Trying to be clever could lead us to use local minima instead of global minimum
        // That being said, we can still do better than dumb brute force
        // if we assume the global minimum is somewhere close to the median, we can start there and then search outwards
        // we still have to check everything, BUT we can cut things short if they go above the current best result
        // if the result is indeed close to the median, we'll be able to early preempt a lot of stuff towards the end 
        let medianOffset = 1;

        let medianIndex = inputs[ Math.floor(inputs.length / 2) ]; // assume we get a sorted array

        let done = false;

        let bestEstimate = getCumulativeOffsets( inputs[medianIndex], Number.MAX_SAFE_INTEGER, inputs );

        console.log("Initial estimate", bestEstimate);

        // inputs is reverse sorted, so smallest number is on the back
        const minimumValue = inputs[ inputs.length - 1 ];
        const maximumValue = inputs[0];

        while ( !done ) {
            let lowTry  = inputs[medianIndex] - medianOffset;
            let highTry = inputs[medianIndex] + medianOffset;
            ++medianOffset; // for next iteration

            if ( lowTry >= minimumValue ) { 
                bestEstimate = getCumulativeOffsets( lowTry, bestEstimate, inputs );
            }
            if ( highTry <= maximumValue ) {
                bestEstimate = getCumulativeOffsets( highTry, bestEstimate, inputs );
            }

            if ( lowTry < minimumValue && highTry > maximumValue ) {
                done = true;
            }
        }

        console.log("Minimum fuel", bestEstimate ); // should be 336721

    }
    
    function execute2(inputs:Array<number>):void {
        const getCumulativeOffsets = function( referenceValue:number, bestCandidate:number, numbers:number[] ) {

            let sum = 0;
            for ( let i = 0; i < numbers.length; ++i ) {
                let absDifference = Math.abs( numbers[i] - referenceValue );

                // using https://www.dcode.fr/function-equation-finder and a few example points from the sequence,
                // apparently the equation for this series is 0.5x**2 + 0.5x
                const correctedDifference = 0.5 * ( Math.pow(absDifference, 2) ) + 0.5 * absDifference;

                sum += correctedDifference;

                // just a sanity check. I don't trust random websites ;) 
                if ( correctedDifference % 1 !== 0 ) {
                    console.error("BAD FORMULA", referenceValue, absDifference, correctedDifference );
                    return 0;
                }

                // we're looking for the minimal sum, so if we go over the bestCandidate... never good
                if ( sum > bestCandidate ) {
                    return bestCandidate;
                }
            }

            return sum;
        }

        // we have to try each and every possible number. 
        // Trying to be clever could lead us to use local minima instead of global minimum
        // That being said, we can still do better than dumb brute force
        // if we assume the global minimum is somewhere close to the median, we can start there and then search outwards
        // we still have to check everything, BUT we can cut things short if they go above the current best result
        // if the result is indeed close to the median, we'll be able to early preempt a lot of stuff towards the end 
        let medianOffset = 1;

        let medianIndex = inputs[ Math.floor(inputs.length / 2) ]; // assume we get a sorted array

        let done = false;

        let bestEstimate = getCumulativeOffsets( inputs[medianIndex], Number.MAX_SAFE_INTEGER, inputs );

        console.log("Initial estimate", bestEstimate);

        // inputs is reverse sorted, so smallest number is on the back
        const minimumValue = inputs[ inputs.length - 1 ];
        const maximumValue = inputs[0];

        while ( !done ) {
            let lowTry  = inputs[medianIndex] - medianOffset;
            let highTry = inputs[medianIndex] + medianOffset;
            ++medianOffset; // for next iteration

            if ( lowTry >= minimumValue ) { 
                bestEstimate = getCumulativeOffsets( lowTry, bestEstimate, inputs );
            }
            if ( highTry <= maximumValue ) {
                bestEstimate = getCumulativeOffsets( highTry, bestEstimate, inputs );
            }

            if ( lowTry < minimumValue && highTry > maximumValue ) {
                done = true;
            }
        }

        console.log("Minimum fuel", bestEstimate ); // should be 91638945

    }
    
    const input = `1101,1,29,67,1102,0,1,65,1008,65,35,66,1005,66,28,1,67,65,20,4,0,1001,65,1,65,1106,0,8,99,35,67,101,99,105,32,110,39,101,115,116,32,112,97,115,32,117,110,101,32,105,110,116,99,111,100,101,32,112,114,111,103,114,97,109,10,616,0,1633,1048,833,967,161,22,823,601,603,538,340,798,1053,400,54,41,54,296,1336,1013,9,763,650,313,15,177,1289,307,741,314,289,63,183,503,764,187,225,596,273,387,1,1165,61,19,78,514,355,605,103,483,291,1781,1137,398,593,38,444,204,274,528,147,131,1021,812,430,710,257,1408,1587,517,773,218,99,357,301,543,1668,11,311,350,373,145,507,325,1006,696,607,281,433,302,148,519,846,1528,766,158,51,850,216,1320,690,338,298,631,560,306,5,888,242,1230,1694,1330,570,184,946,97,96,272,537,312,1246,847,138,325,28,253,785,483,906,412,28,178,485,828,823,1035,1001,108,1068,90,308,223,18,191,1269,39,238,307,7,643,1546,203,254,371,402,207,666,786,793,361,441,105,15,421,1748,255,152,1376,626,296,707,4,627,885,49,316,34,379,1591,39,1087,135,1515,69,725,419,924,414,78,1169,8,1331,2,771,1295,570,323,9,406,75,42,1003,180,188,174,145,128,625,1312,85,427,56,15,87,449,831,906,34,186,609,1597,531,104,1034,615,608,1338,192,280,982,334,853,1155,194,124,205,1384,135,906,239,761,1357,16,328,623,3,1432,634,1698,31,981,347,75,222,896,77,1204,1272,711,106,772,1366,279,162,98,487,1281,188,71,307,398,470,40,12,459,449,984,1271,260,1132,493,1117,129,36,1040,947,570,89,853,373,102,771,107,266,106,59,485,61,87,353,164,278,1489,542,442,4,62,788,63,130,723,919,1169,327,459,431,1107,992,1162,1287,901,838,638,261,307,761,533,119,336,4,422,173,172,64,222,531,998,1250,1007,20,1231,69,289,531,757,185,519,184,1139,369,2,1102,857,339,1267,1357,217,774,1352,23,136,2,1389,253,87,883,28,247,292,15,332,69,170,20,544,75,850,310,1137,301,155,265,100,842,189,7,584,40,168,22,548,7,30,1027,744,1294,329,100,1255,424,515,460,163,375,26,618,275,1012,935,160,181,84,186,990,1208,152,753,508,590,578,81,625,600,430,306,311,156,5,56,187,25,249,1090,316,224,173,199,71,221,1219,335,87,260,607,121,25,1326,473,224,92,87,734,179,64,325,320,117,302,1247,879,716,984,284,239,738,30,90,61,844,997,823,387,956,842,580,540,648,1947,32,63,380,873,1086,142,512,206,742,584,157,858,1300,992,311,139,906,693,1,36,1320,236,48,58,32,147,34,229,497,1,657,616,309,494,1419,264,595,729,1374,984,74,446,436,77,1516,156,915,565,159,269,263,442,775,12,6,337,115,971,598,87,1283,533,991,204,1382,1204,277,27,801,260,198,426,89,72,458,1164,571,1329,501,1547,125,376,865,642,268,626,167,429,901,623,103,100,1064,125,450,695,28,1470,469,187,119,1363,44,485,1243,1163,507,139,147,72,100,160,624,506,1360,66,444,581,729,531,701,1091,178,476,22,926,354,88,1076,946,213,38,43,125,291,714,113,54,1214,1067,641,374,411,64,1364,415,133,752,372,212,19,1941,780,902,512,852,157,8,175,90,913,125,771,764,381,947,572,391,313,249,201,106,1500,487,107,868,464,984,1471,550,642,196,571,18,306,293,659,1274,290,352,0,528,754,564,316,685,57,293,75,584,251,1107,217,11,21,329,493,175,600,259,380,30,148,556,136,180,12,26,507,199,3,0,143,87,1452,359,989,170,64,269,17,1018,105,317,289,127,275,269,359,511,690,205,423,356,19,177,260,789,51,119,210,1151,707,869,194,773,159,216,759,16,161,47,1254,293,54,504,432,1230,213,26,253,424,98,1515,162,346,326,12,122,79,210,912,55,705,597,369,1381,284,1163,316,34,384,36,1254,1455,994,60,1395,476,100,38,726,198,605,103,489,361,9,24,158,1056,264,1103,175,1423,266,45,93,271,331,673,788,48,12,580,697,593,480,268,559,302,87,281,6,401,170,90,939,543,223,137,809,139,182,571,68,1112,20,1004,1090,249,1435,267,10,375,504,906,946,1503,1362,184,233,112,1058,16,235,548,563,162,102,746,439,105,259,27,19,817,1444,119,175,341,130,202,31,432,480,710,1127,682,454,134,823,168,276,113,914,1112,118,10,1041,902,141,1428,282,485,353,589,906,987,488,144,154,25,930,368,261,176,168,85,814,1915,248,49,1012,3,143,951,30,411,336,46,1383,26,857,1650,192,1477,194,73,154,91,287,229,144,675,989,135,360,74,60,223,219,625,182,793`;
    
    execute(input);
}