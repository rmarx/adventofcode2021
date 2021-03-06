
{
    function execute(input:string) {
    
        // input = `[({(<(())[]>[[{[]{<()<>>
        //     [(()[<>])]({[<{<<[]>>(
        //     {([(<{}[<>[]}>{[]{[(<()>
        //     (((({<>}<{<{<>}{[]{[]{}
        //     [[<[([]))<([[{}[[()]]]
        //     [{[{({}]{}}([{[{{{}}([]
        //     {<[[]]>}<{[{[{[]{()[[[]
        //     [<(<(<(<{}))><([]([]()
        //     <{([([[(<>()){}]>(<<{{
        //     <{([{{}}[<[[[<>{}]]]>[]]`;

        const inputs:string[][] = input.split("\n").map( (str) => str.trim() ).map( (str) => str.split("") );

        // return execute1(inputs);
        return execute2(inputs);
    }
    
    function execute1(inputs:Array<Array<string>>):void {
        
        let score = 0;

        const openingChars = ["(", "<", "[", "{"];
        const closingChars = [")", ">", "]", "}"];
        const charScores   = [ 3, 25137, 57, 1197]

        for ( const line of inputs ) {

            const stack = [];

            for ( const char of line ) {
                if ( openingChars.includes(char) ) {
                    stack.push( char );
                }
                else { // implicit closing char
                    const closingIndex = closingChars.indexOf(char);
                    const openingChar = openingChars[closingIndex];

                    if ( openingChar != stack[ stack.length - 1] ) {
                        // corrupted line!
                        // console.log("Corruption found!", line, char, openingChar, charScores[ closingIndex ] );
                        
                        score += charScores[ closingIndex ];
                        break;
                    }
                    else {
                        stack.pop();
                    }
                }
            }
        }

        console.log("Corrupted scores", score); // should be 362271
    }
    
    function execute2(inputs:Array<Array<string>>):void {
        let scores = [];

        const openingChars = ["(", "<", "[", "{"];
        const closingChars = [")", ">", "]", "}"];
        const charScores   = [ 1,   4,   2,   3 ];

        for ( const line of inputs ) {

            const stack = [];
            let score = 0;

            let corrupted:boolean = false;

            for ( const char of line ) {
                if ( openingChars.includes(char) ) {
                    stack.push( char );
                }
                else { // implicit closing char
                    const closingIndex = closingChars.indexOf(char);
                    const openingChar = openingChars[closingIndex];

                    if ( openingChar != stack[ stack.length - 1] ) {
                        corrupted = true;
                        break;
                    }
                    else {
                        stack.pop();
                    }
                }
            }

            if ( corrupted || stack.length === 0 ) { // incomplete lines must have something left on the stack
                continue;
            }
            
            while( stack.length > 0 ) {
                const openingChar = stack.pop();
                const openingIndex = openingChars.indexOf( openingChar! );

                const charScore = charScores[ openingIndex ]; // no need to lookup closingIndex since I've made sure those are the same in the arrays

                score = (score * 5) + charScore;
            }

            scores.push( score );	
        }

        scores = scores.sort(function(a, b){return a-b});

        console.log("Middle score", scores[ Math.floor(scores.length / 2) ]); // should be 1698395182

    }
    
    
    
    const input = `{{<{{{{([{[([[()<>]{<>{}}]<([]())(()<>)>)((({}())[()[]])<<[][]>[{}[]]>)]{{(<{}<>>{<><>}]([<>[]]<
        [(<{{[{(<({{<<[]()><<>{}>>([<>[]]{<><>})}})>)}]}}>[{(<{({[{[[({}())((){})]({{}[]})]<<[<>{}]([][])>({<>()}
        (({<{[{({(([[([]())({}())]]({[[]{}]([][]))<((){})<{}<>>>))[(([<>[]]<[]>)(([]{}){{}{}}))])})[({<[{
        ([{{[([<({<<<([]())[()[]]>{<()[]>[[]()]}>[{<[]{}><[]>>{<<>()>{[]()}}]>[[[[[]{}]([]<>)]<{<>{}}
        [[((<({<(<{<<{{}()}{[][]}>[((){})]>}>{((<({}<>)<{}()>>[[<>()]])<<<[][]><<>[]>>{<{}[]>(<>())}>)<{[[{
        [{<{{{{<([{[(<[]<>>(<>[])){({}<>)([]<>)}]{{([][])[<>{}]}{<[]<>>(<>{})}}}])<<{[<[<>{}]<(){}>>{<{}<>><<>
        (({({([(<[[([[{}{}]([]<>}][(<>()){(){}}])]](({{{{}<>}<{}[]>}([{}[]][(){}])}[(<[]{}>({}()))<<<><>>>])<[{
        [{<((<{(<{<<{[()()](()<>)}<({}[])([]<>)>>{(<<><>>[[]{}])[[[]()](<>[])]}>{[[({}<>)([]<>)][[{}[]
        {<{<{{(<[[{[[({}[])[()[]]]([()<>][{}[]])]<<({}())[{}{}]><[<>[]](<><>)>>}(([([]{})((){})]((<>)([]{}))))]<{<<<
        <{(<<(<[<{<[{[<>[]][{}{}]}{{()<>}{<><>}>]>[<(([]{})[[]])>]}<[<([{}{}][<><>]){([]{})}>]({<{<>()}>{
        {[[<{{{<<<[<((()<>)({}{}))<{{}()}>>]<((([]{}){{}<>})[{{}<>}([]{})])({{()[]}[[]()]}[{{}()}({
        <[[[{{([{[({[<{}[]>[{}()]]{<()>}}({<()()>}<<<>()>{[]}>))]((({({}[])>{[(){}]{<><>}})(({()[]}[()<>]
        [([([([<[{{<[[{}[]]{<>{}}][<{}>(()[])]>[({<>()}(()[])){<[][]>{()[]}}]}}<{(({()}([]()))(([]())<()[]>))<((<>{}
        <{[{(({([([[{((){})[[]]>{{{}[]}[<>()]}]])]{([([<[]{}>((){})]<[()<>]<()()>>)][<<{<>{}}{<><>
        [[{{(([{(({[[{{}[]}]][<<<>()>({}{})>[[{}<>]{{}<>}]]}[(({{}}{[][]}){[{}{}][<>[]]})(<<<>{}><<><>>>)])<[
        [[{([<<([[<(<{<>()}<[][]>>{[<>[]]{()[]}}){[<[][]><{}()>][([]())<<><>>]}>]((<<[(){}][(){}]><([])>>))
        [{[<{(([(([([(<>[]}(<>{})][<{}[]>[()[]]])<{[{}<>]<[]<>>}{{[]<>}{{}{}}}>]<<{[<>{}](<>())}{{()[]}{<>{}}}>[
        {({<[(((<{<<[[()<>]]<({}<>)>>>[<({[]<>}{()<>})[[()<>][<><>]]>({[{}[]]({}<>)}[<(){}>(<>())])]}><[{<[[<>
        <(((({{(<({[<<[]<>>>([()()]{<>()})][<[{}{}]{<>()}>{{{}{}}[[][]]}]}{(<<<><>>(()<>)>(<<>()>[()[]]))
        [<{{[{[[[<(({<()()>[(){}]}[([]())[(){}]]))>{[<[[[]]<[][]>]{[[][]](()())}>[(<<>()>{[]<>})(({}())<{}[]>)
        (<[[((<<({[(([()[]]([]<>)){{(){}}})]{<(<<><>><[]{}>)<<{}<>]([]<>)>>}}){(<{<{[]{}}[{}<>]>}>{({(<><>)<()[]>}{((
        {[{((<{<<<<([<[]{}>[[][]]]<[[]()][<>[]]>)[[<{}[]>{{}()}](<()<>>[<>[]])]>>[{([<()[]>{{}[]}](({}{}
        (<([<((<{[<<(((){})<<><>>)<[{}()]<[]<>>}>[([[]{}](()[]))]>[<{({}()){{}()}}>[(([]<>)({}[])){
        {((((<(({[(<{<()]([][])}>){[<[[][]]>]<{{{}<>}[[][]]}>}]}[<{([{[]{}}]{[(){}]<<>()>})[(<()<>>{()<>
        <<{([{<[[[<{([[]<>]){[<>()][(){}]}}[{(()[])[()[]]}]>][{{[{{}[]}<()<>>]>[[{(){}}[<>[]]][[<>[]]({}()
        <((<[<(([<[{({<><>}(()[]))}]<[<[{}()]<()[]>>(<()()>)][[(<>())<()())]<{<>}<{}>>]>>({{<<<>[]><<>(
        [({{{{{{(([[<<()()><<>[]>>[{[]<>}]]{(<{}<>>(()[]))<<[][]>(()())>}]([<({}()><[][]>>]<{[[][]]<[]<>>}(
        (<(<{{<[{{{[<[<>[]]<[]{}>>[{<>{}}{()()}]]{<<{}()>(<>())>[[{}[]]]}}}}][{([{[([]{})<()[]>][[<>{}]{()[]}]}(([()
        {[<<(<<<{[<<<<[]<>><()[]>>[({}[])[[]<>]]><((<><>)[{}<>])[{{}{}}[[]()]]>>{{{[<><>]<<>()>}[<[]{}>([][])]
        <(<{<(<({[[{((()[])[{}<>])([<>()]>}{[({}{})[(){}]]<[()<>]({}[])>}]{[<{[]{}}><{[]{}}[[][]]>][[<{}<>><()[]>]<[
        {<({[<((<<<{{([]<>}{<><>}}<{<>{}}[[]<>]>}>{<[{{}}(()())]>}>(<<{[(){}]<()[]>}({(){}}[()<>])>[<<<>[]>{[]
        {(({<{{{{{((<{[]<>>(<>{})>[[<>()]])<<(()())[<>]><[(){}][{}{}]>>)}({([[[]]]{<{}{}><()[]>})<{[(){}][[]()]}>
        <<[<<[((({[[(<{}[]>({}())){[()()]}][{{<>{}}<<>()>}[<{}[]>[<>[]]]]]{<(([]())([]()))>{([()()]<<>[]>)[<
        {([<<<({((<{{[<>[]][<>{}]}<<<>[]>[[][]]>}[{[()[]]<<>[]>}<[{}{}]<<><>>>]>({[<[]<>>]<<()()>([][])>}(((<
        (<{<((<{[[<[(<[]{}>{<>{}})][<([][])[{}<>]>[<{}<>>]]><<[(<>[])[{}<>]]{<{}{}><{}[]>}>(<([]<>){()[]}>)>]]}{({[<(
        [{{(({<<<<{{<({}()){{}{}}>[(()[])]}[([(){}]{<>[]})[(<>())[{}]]]}>[<<<{[]{}}{{}{}}>]{<[{}<>]>{(()())}}>[{(<[]<
        {[<<{<[[({{<<{()[]}<<><>>>([[]<>>[{}[]])>}[[[([]<>)[<>{}]]]<<[<>()](<>{})>>]})(((({({}[])<<><>>}([<>])))((<
        [{(({({<({(<{{[][]}({}<>)}[{()()}{[][]}]>(((<><>)(<>()))([{}()][{}()])))([{[[]()]<[]{}>}{(
        {<{{<[<<[(<([({}())[{}()]]{{{}<>}<[]>}){[((){})<[][]>]<([]())({}[])>}>{<(((){})[()<>])(<()[]>[(){}]
        {({({<{{(<([<[<><>]((){})>{{()[]}<<>{}>}]{[(<>())<{}[]>][{()<>}[[]()]>})>[[<{([])[()[]]}><<[(){}]({}())>>]{
        (<{{(<<<{(<(({<><>}{()[]})<[{}[]]([]())>)([(()<>)[[]<>]]({[]()}{{}{}}))))[(<{{()[]}<()[]>}((<><>))>[[
        <<[<([{<<[[({<[]<>><<>()>}{([]<>)[[]<>]}){[<{}{}><()[]>]<{<>()}{<>()}>}]{{<({}{})>})]>[<({<
        (<<[[({[({(<{{[]{}}<[]{}}}>[<<()<>><{}<>>>(<()()>{{}<>})])}{<({({}[])<()>}<([]())<{}<>>>)<<[(
        [<(<{(([(<([[<<>{}>(<>{})]](((()[])[[]()])[[{}<>]({}{})]))><<{<([]<>){[][]}>[{<>[]}<()<>>]}>(<((<>[]){()<>}
        [<{[[{(([[{[{<[]<>>(<>[])}<<<>()>{{}{}}>][({[][]}<<>>){(<>[])[<><>]}]}(([([][])(<>[])]{(()())}))](<<{
        ((<{<<([<[(([{()()}((){})][<()[]><()[]>])<{({}<>){{}<>}}>)[{(<<><>>)<{{}[]}>}({(<>()){()}}{([
        [({{{{((([({{(<>[])[[]<>]}([{}])}(({<><>}{<>()})[[{}[]]]))<{[[<>{}](()[])](<()<>>{[]()})}{{<()()
        [<[<({[[({[[[<<>[]>]({[]}[<><>])]{[[()<>]([]())]<({}{})[[][]]>}]}<<(([()()]<()<>>)<{()()}[()[]]>
        {<([[<[<<(([<(()[])(()<>)>{[<><>](<>[])]]{({{}})}){<((<><>)<{}<>>)((()[])[[]()])>})<<(<(())(
        <[<((<{(<[[({{{}()}({}{})}}<[[()<>]]<[()()][<>]>>]<[([()()]({}<>))[<{}()>([]<>)]]>][{[[(()())[()]][[<>[]
        [{(<(<[((<{(({(){}}[()[]])<{[][]}(<>{})>)[(<<><>>[()[]]]{[{}[]]{()<>}}]}><[<[[{}()](()[])][(<>()){<>()}]>[{
        ([({<({{{[[<[{{}<>}([][])]{[(){}]{()<>}}>][{[{[]<>}][<{}()>]}]]}{((<[{{}[]}(()()))[{<>[]}]>({(<>{})<[]<>>}
        {[({[<[([(<{((<>{})<{}{}>)}(<[[]()]<{}{}>>({{}[]}{[]<>}))><[((()[])(())){([]<>)[()[]]}]<({()
        [(<<<([{[[[<<<<>>{{}<>}>[{[]()}]>[([[]{}]{[]<>}){[<>()]}]]]]}]<<((<([{[][]}<{}<>>]<[[]{}][[]<>])){{[<>[]
        {[{{[[{{[<[<<{{}<>}<[]{}>><<()[]>[<>[]]>>[([<>{}](()()))]]>{({([{}[]](<><>))<<(){}>(<>{})>}({([]<>)[{}[])}(<<
        <{([[{<[<{{([(<>{})[<>()]]){{[()[]]([])}}}[{<((){})([]())>}(<{[][]}<<>{}>>[[[][]]<()()>])]}>[
        {(<[({{(<<<{[(()())]<[<>[]][{}{}]>}[[<()[]>{[][]}]]>(<((<>())[()[]]){{()[]}{[][]}}>({{[]<>}<[][]>}(<[]{}
        <{{[{((((<[{({[]{}}<(){}>)}[[{[][]}<<>{}>]<<[][]>{[]}>]]>{{([((){})<<>{}>]{{()()}})<[<<>()>](<<>>[()
        <([({(<<<{[<{(()<>)(<>[])}([<>]{<>{}})>]<(<<<><>><{}()>>[([][]){[]<>}])>}{[([[[]<>]{(){}}]<[{}<>]{{}<>}
        {<<<[{[(<[([([[]()]<()[]>)(([]())({}[]))]<[[()<>]]<[(){}]<[][]>>>)(<{<[][]>)<(()<>)<{}[]>>
        {[[<[[<(<[[{(<()<>>)<{{}<>}[[][]]>}<<(()()){[]{}}>{<[]()>>>]]>)({<<<<[{}{}]{<>()}>{<<><>>([]{})}>>[([<()()>(
        [[[{({{({[{[(({}())(<>[]))<<<>[]>[[]<>]>]<<<()()><<>>>[({}())(<>[])]>}[({<(){}>({}{})}[[{}()]]){[[[]<>
        <(((<<[{[[<({({}<>)[{}()]}[{[]{}}([]())]){([[]<>]<[]<>>)[(()[])[{}[]]]}>(<<<{}[]><()[]>)>[[<{}(
        [<<{[{{<<[[{<<()[]>(())><<{}()][<>()]>}({[{}{}][<>()]}<([]())([])>)]({{{[][]}[<>{}]}<[()]{{}()}>}(({
        {([(<[[<(<<<(<<><>><{}<>>)({{}()}[<>()])>{([(){}][[][]]){[<><>]{<><>}}}>>(({(<<><>><()<>>){{()<>}{(){}}}}
        [(<([[[([(({[[<>[]]]}))([{{[{}()]([]<>)}{{<>[]}[[][]]}}(<([]())>[([]{}){()<>}])][<{<()[]><()()>}>{<([
        {([[<<[[<[[[<[{}[]]{[]<>}>[<{}()>{<>[]}]]]<[<{[][]}(<>[])>[[{}[]]<[][]>]][((()[])[<>{}]){{{}()}[(){}]}]>]>
        {[[[<<{{[<<<([{}[]]<<>[]>)([()]<{}{}>)>({<<>{}>(()[])})>[(((<><>>{<>{}})<<<>[]>[[]()]>)({(()(
        [[[{<<(({{[((<{}<>>[{}])({<>{}}<{}{}>))[(<{}()>(<>{}))(<<><>>{{}{}})]]({{<()>}}(<{(){}](<><>)
        (({{[[[<[{<{[<{}()><<>{}>]}({[[]()]<{}[]>])>}[<{{(<><>)<{}()>}{{{}<>}{{}[]}}}(([<>[]]([][]))
        <[<<{({[(<(<{({}<>)<[][]>}{(()[])({}[])}>{(<{}{}>>})>([<<<<>{}>((){})>[(()())[[]()]]><{[{}<>]<<>
        [{<{[(<[[[{({({}<>)(()<>)}{<[][]>})}{[<[()[]]{[]<>]>{<{}()>(()())}]{[<()()>{<>[]}]<[<><>]>}}]
        ({{<{[[[([({{<<>()>(()<>)}(<{}()><()[]>)}<[[{}()]<{}[]>]{((){}){{}[]}}>)[([{<><>}<()<>>][(<><>)(()())]
        (({<{{{[([{<<<{}{}>{[]{}}>([<>[]]{[]{}})>}{<<{[]{}}[[]{}]>{<<>{}>([]())}><(<(){}>({}[]))[(<>[])(()<>)]>
        <[<(<{[[<([({[<>()][<>{}]}{{()()}[<><>]})]<[[<[]()>]<[{}<>]([])>]{<[<>[]]<<>()>]((<>())[<>{}])}>)([{<[[][]]
        <<{{((({<<[[<{<>()}(()())>[(()[])[()<>]]]{({{}[]}[<><>])}]<{<<<><>>{{}[]}>}<[<[][]>[{}[]]](<()()>{[]{}})
        [<<{<{([{(({[{()[]}{()}][({}{})(()[])]}{({<>()})({[]()}({}[]))}))}][[[([[{<>[]}[{}[]]][[<><>]<()[]>]]([
        [([[{{<(<[{(<<()<>>><[[]()]{()()}>)<(({}()){[]<>})>}]>)>{<[<{{((()())({}<>)>{([]{}){{}<>}}}}<({
        ((<<{(<[(<[[<({})>[{[][]}[<>[]]]]]>)]>)}([(<[[([(([][]))[{{}()}([][])]][((<><>){[]()})])]]<<(
        <<<<(<{[{[({<{(){}}[<>]>[<[]<>>{<>()}]}[<[<>()]>{[[]<>][{}[]}}])(<{<(){}>[{}{}]}<(()<>)<()[]>>>)][<{{<[]<
        (([[<{[({{{[<<<><>>(()())>({[]<>}(<>()))]{<[<>()][{}{}]>([[]()]((){}))}}((<({}{})[<>]>([<>()]{(){}})))}[<{([<
        {[([<<[([[<[(<[]()>{()[]})<{<>()}{(){}}>]><<{<[][]><{}()>}(<[]<>>([]<>])>>]{[[<<{}<>>({}[]
        {{[<<(<({[<<{<[]<>>}{(<>())}>[{[<>]{(){}}}]>]}{{{<([()<>]{<>{}})(<()[]>[[]()])><[<<>[]>({}{})]((()())[{
        [{{[<{<<{{<[<<()()>[{}]>([{}{}]({}{}))]{(<[][]>([][]))(([]{})<<>[]>)}>}({{<{<>[]}[<>()]>(({
        [<{[(<<[<<(([[<>[]]][([]())({}<>}])){(({[]()}{()<>})[<[]{}>(<><>)])[<[{}[]][{}{}]><{(){}}<{}{}>>]}>({<<[[]()
        [({[<<<({<({({{}<>}[[]{}])}({({}<>)<<>[]>}))([<{(){}}>])>}{<{[[{{}{}}(<>{})]]<[[()[]]<<><>>]{[<><>]<{}()>
        [<{<<<<(([([[{{}()}[<>]][((){})[[]{}]]](({[]()}[[]()])[{[]()}(<>[])])){[{<<><>>{{}<>}}<{()[]}[[]
        [{({<(((<({{({[]()}))[((()())<[][]>)<{<>{}}(<><>)>]}{[<[[][]](<><>)>][[{<>{}}[<>{}]](<<>[]>{[][]})]})>)))>}
        [[{[[{({[([(<<<>[]>[<><>]>([{}()][<>()]))<<[<>{}]{{}<>}>[<<>{}>([]{}]]>])<(<(<[]()>)[(()[])
        <([(<<[<<({{{([]{})}[{()<>}<[]()>]}}{(<{[]{}}([][])>)})[[[<[[][]]<<><>>><{{}{}}(<><>)>]<<(()())[(){}]>{
        [(<{[{({[({<{<{}[]><<>()>}{<{}()>[[][]]}><<{{}()}{(){}}>>}[<{{<>{}}{()())}>]){[<[{()()}<[]()>]><[[{
        <{<[{([([<<[<[<>()]{(){}}>][({{}[]}((){}))[<[][]><()<>>]]>>{{{<{<><>}{(){}}>({<><>}<()))}({<()><{}[]>}(<(
        ({((([[{([<[(([]{})){[()<>][<><>]}]>{[<<{}{}><()[]>>(<<>>)]({<<><>>[<>{}]}{<[]{}><<>{}>})}])[(<(([<><>][{}{
        <[<(([(({([[<(()[])[[]{}]>{<<>{}>(<>{})}]]([([<>{}]{[]{}})][{<()>{()[]}}(({}[])(<>[]))]))})({{[(({(){}}[<>`;
    
    execute(input);
}