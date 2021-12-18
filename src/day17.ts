
{
    class Bounds {
        public minX:number = 0;
        public minY:number = 0;
        public maxX:number = 0;
        public maxY:number = 0;

        constructor( minX:number, maxX:number, minY:number, maxY:number ){
            this.minX = minX;
            this.maxX = maxX;
            this.minY = minY;
            this.maxY = maxY;
        }

        public test( x:number, y:number ):readonly [ boolean, boolean ] {

            const inBounds:boolean = (x >= this.minX) && (x <= this.maxX) && (y >= this.minY) && (y <= this.maxY);
            const beneathY:boolean = y < this.minY;

            return [inBounds, beneathY];
        }
    }

    interface Point {
        x:number;
        y:number;
    }

    function execute(input:Bounds) {

        // puzzle input is always small enough so we can just skip the parsing step :)
        // input = new Bounds(20, 30, -10, -5);

        // return execute1(input);
        return execute2(input);
    }
    
    function calculateTrajectory( position:Point, velocity:Point, bounds:Bounds ):number {

        let maxCandiateHeight = Number.MIN_SAFE_INTEGER;

        for ( let step = 0; step < 10000; ++step ) { // 100 was way too low, 10000 seems a good upper bound
            
            position.x += velocity.x;
            position.y += velocity.y;

            velocity.x += (velocity.x > 0) ? -1 : ((velocity.x < 0) ? 1 : 0);
            velocity.y -= 1;

            if ( position.y > maxCandiateHeight ) {
                maxCandiateHeight = position.y;
            }

            const [inBounds, belowBounds] = bounds.test( position.x, position.y );

            if ( inBounds ) {
                // if ( maxCandiateHeight > 10000 ) {
                //     console.log("IN BOUNDS", position, velocity, "@", maxCandiateHeight, "after # steps:", step );
                // }
                return maxCandiateHeight;
            }
            else if ( belowBounds ) { // no need to continue stepping if already below target area
                // console.log("below bounds", position.y );
                return Number.MIN_SAFE_INTEGER;
            }
        }

        return Number.MIN_SAFE_INTEGER;
    }

    function execute1(bounds:Bounds):void {
        
        const startPosition = { x: 0, y: 0 };

        let maxValidHeight = Number.MIN_SAFE_INTEGER; // end result

        // need to guess some heuristics for initial velocities
        // we know we want to fire into the top right quadrant though
        // heuristics attempt 1: x [2, bounds.maxX[, y [minY, 100[ => gives 1176, which is too low
        // had to increase amount of steps to 10000 per trajectory, and give higher Y as well (optimal Y appeared to be 147)

        for ( let velX = 0; velX < bounds.maxX; ++velX ) {
            for( let velY = bounds.minY; velY < 200; ++velY ) {
                const velocity = { x: velX, y: velY };

                const maxHeight = calculateTrajectory( { x: startPosition.x, y: startPosition.y }, velocity, bounds );
                maxValidHeight = Math.max( maxValidHeight, maxHeight );
            }
        }

        console.log( maxValidHeight ); // should be 10878, for velocity (17, 147)
    }
    
    function execute2(bounds:Bounds):void {
        const startPosition = { x: 0, y: 0 };

        let inBoundsCount = 0;

        // needed a bit wider range of search here than for nr 1
        for ( let velX = 0; velX < bounds.maxX + 100; ++velX ) {
            for( let velY = bounds.minY; velY < 200 + 100; ++velY ) {
                const velocity = { x: velX, y: velY };

                const maxHeight = calculateTrajectory( { x: startPosition.x, y: startPosition.y }, velocity, bounds );
                if ( maxHeight > Number.MIN_SAFE_INTEGER ) {
                    ++inBoundsCount;
                }
            }
        }

        console.log( inBoundsCount ); // should be 4716
    }
    
    
    
    // const input = `target area: x=139..187, y=-148..-89`;
    const input = new Bounds(139, 187, -148, -89);
    
    execute(input);
}