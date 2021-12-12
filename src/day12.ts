
{
    function execute(input:string) {
    
        // input = `start-A
        // start-b
        // A-c
        // A-b
        // b-d
        // A-end
        // b-end`;

        // input = `dc-end
        // HN-start
        // start-kj
        // dc-start
        // dc-HN
        // LN-dc
        // HN-end
        // kj-sa
        // kj-HN
        // kj-dc`;

        // input = `fs-end
        // he-DX
        // fs-he
        // start-DX
        // pj-DX
        // end-zg
        // zg-sl
        // zg-pj
        // pj-he
        // RW-he
        // fs-DX
        // pj-RW
        // zg-RW
        // start-pj
        // he-WI
        // zg-he
        // pj-fs
        // start-RW`;

        const inputs = input.split("\n").map( (str) => str.trim() );

        // I won't use a real tree structure since we don't get pointers and other good stuff here anyway
        // it's much easier to just use a hashmap and have strings as links
        const locations:Map<string, Array<string>> = new Map<string, Array<string>>();

        for( let input of inputs ) {
            const nodes = input.split("-");

            if ( !locations.has(nodes[0]) ) {
                locations.set( nodes[0], [] );
            }
            if ( !locations.has(nodes[1]) ) {
                locations.set( nodes[1], [] );
            }

            locations.get(nodes[0])!.push( nodes[1] );
            locations.get(nodes[1])!.push( nodes[0] );
        }

        console.log( locations );


        // return execute1(locations);
        return execute2(locations);
    }
    
    function execute1(locations:Map<string, Array<string>>):void {
    
        const explore = function( currentNode:string, currentPath:Array<string>, allPaths:Array< Array<string> > ) {

            if ( currentPath.indexOf( currentNode ) >= 0 && (currentNode.toLowerCase() === currentNode) ) {
                // already visited this node, stop recursion
                return;
            }

            currentPath.push( currentNode );

            // found a full path: add to final list and stop
            if ( currentNode == "end" ) {
                allPaths.push( currentPath );
                return;
            }

            console.log("Exploring", currentNode, locations.get(currentNode));

            for ( let neighbour of locations.get(currentNode)! ) {
                // need to make a copy of currentPath, since it branches with the new nodes we're visiting
                const duplicatePath = currentPath.slice();

                explore( neighbour, duplicatePath, allPaths );
            }
        }

        const allPaths:Array< Array<string> > = [];
        explore( "start", [], allPaths );

        console.log( allPaths, allPaths.length ); // should be 3738
        
    }
    
    function execute2(locations:Map<string, Array<string>>):void {

        const explore = function( currentNode:string, currentPath:Array<string>, allPaths:Array< Array<string> > ) {

            // we don't really want to pass around another boolean
            // we also dont'want to make a proper Path class, because we're lazy
            // as such, abuse the fact that you can set any property on any JavaScript object, even Arrays!
            // so (currentPath as any).hasDoubleSmallCave is our indicator that we have visited a single small cave twice
            // (we could re-check all the time via a Set, but what's the fun in that)
            // Note: this does potentially cause V8 to put the array on a slow path because it now has a different shape... so potentially not ideal!!!

            const isLowercaseNode:boolean    = (currentNode.toLowerCase() === currentNode);
            const hasDoubleSmallCave:boolean = (currentPath as any).hasDoubleSmallCave === true;

            if ( isLowercaseNode && currentPath.indexOf(currentNode) >= 0 ) {
                if ( hasDoubleSmallCave || currentNode == "start" || currentNode == "end" ) {
                    // already visited this node and another small cave twice, stop recursion
                    return;
                }
                else {
                    (currentPath as any).hasDoubleSmallCave = true; // will be adding this small cave a second time now below
                }
            }

            currentPath.push( currentNode );

            // found a full path: add to final list and stop
            if ( currentNode == "end" ) {
                allPaths.push( currentPath );
                return;
            }

            // console.log("Exploring", currentNode, locations.get(currentNode), currentPath);

            for ( let neighbour of locations.get(currentNode)! ) {
                // need to make a copy of currentPath, since it branches with the new nodes we're visiting
                const duplicatePath = currentPath.slice();
                (duplicatePath as any).hasDoubleSmallCave = (currentPath as any).hasDoubleSmallCave;

                explore( neighbour, duplicatePath, allPaths );
            }
        }

        const allPaths:Array< Array<string> > = [];
        explore( "start", [], allPaths );

        console.log( allPaths, allPaths.length ); // should be 120506
    }
    
    
    
    const input = `zs-WO
    zs-QJ
    WO-zt
    zs-DP
    WO-end
    gv-zt
    iu-SK
    HW-zs
    iu-WO
    gv-WO
    gv-start
    gv-DP
    start-WO
    HW-zt
    iu-HW
    gv-HW
    zs-SK
    HW-end
    zs-end
    DP-by
    DP-iu
    zt-start`;
    
    execute(input);
}