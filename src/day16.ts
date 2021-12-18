
{
    class BitStream {

        public rawBytes:DataView;
        public currentByteIndex:number = 0;
        public currentBitIndex:number = 7; // we start reading on the left

        constructor( uints:Uint8Array ) {
            this.rawBytes = new DataView( uints.buffer );
        }

        public getCurrentOffsetInBits() {
            return this.currentByteIndex * 8 + (7 - this.currentBitIndex);
        }

        public getBits( bitCount:number ):number {

            if ( bitCount > 32 ) {
                console.error("BitStream only supports up to 32-bit extractions for now!")
                return 0;
            }

            // we do this bit-by-bit, which isn't great...
            // however, I don't want to spend hours doing this properly
            // e.g., one optimization would be to append entire uint8's (bytes) if we have enough bits remaining
            // and/or to use masks across all remaining bits in the current byte instead of only for the one bit tested
            
            let bitsRemaining:number = bitCount;
            let output:number = 0;

            // console.log("getBits", bitCount);

            while ( bitsRemaining > 0 ) {

                if ( this.currentByteIndex >= this.rawBytes.byteLength ) {
                    console.error("READING PAST END OF BUFFER", bitCount, this.currentByteIndex, ".", this.currentBitIndex);
                    throw new Error("BitSTream read past end... not supported : " + bitCount + " @ " + this.currentByteIndex + "." + this.currentBitIndex);
                    // return output;
                }

                let currentBitValue = (this.rawBytes.getInt8( this.currentByteIndex ) & (1 << this.currentBitIndex)) == 0 ? 0 : 1;
                output += currentBitValue << (bitsRemaining - 1);
                
                // console.log( this.currentByteIndex + "." + this.currentBitIndex, currentBitValue, output.toString(2) );

                --this.currentBitIndex;

                if ( this.currentBitIndex < 0 ) {
                    this.currentBitIndex = 7;
                    this.currentByteIndex += 1;
                }

                --bitsRemaining;
            }

            return output;
        }
    }

    class Packet {
        public version:number;
        public type:number;

        public literal:number;
        public subPackets:Array<Packet>;

        constructor() {
            this.version = -1;
            this.type = -1;
            this.literal = -1;
            this.subPackets = new Array<Packet>();
        }
    }

    function execute(input:string) {
    
        // input = `9C0141080250320F1802104A08`;


        // input = `E3CF`; // 0b111 000 1111 001111
        // console.log( bitStream.getBits(3).toString(2), bitStream.getBits(3).toString(2), bitStream.getBits(5).toString(2), bitStream.getBits(5).toString(2) );

        const inputs = input.split("");

        const bytes = [];
        for ( let c = 0; c < inputs.length; c += 2 ) {
            bytes.push( parseInt( inputs[c] + inputs[c + 1], 16 ) );
        }
        
        const uints = Uint8Array.from( bytes );

        const bitStream = new BitStream( uints );

        // return execute1(bitStream);
        return execute2(bitStream);
    }
    
    function parsePackets( bitStream:BitStream, allPackets:Array<Packet> ) {

        let done = false;
        while( !done ) { // bitStream will throw if we go past the end
            
            try {
                const p = parsePacket( bitStream );

                console.log( "PACKET FOUND", p );

                // TODO: need to recursively add all subpackets
                allPackets.push( p );
            }
            catch( e ) {
                done = true;
            }
        }
    }

    function parsePacket( bitStream:BitStream ):Packet {
        const packet = new Packet();

        console.log("Parsing packet", bitStream.getCurrentOffsetInBits() );

        packet.version = bitStream.getBits(3);
        packet.type = bitStream.getBits(3);

        if ( packet.type === 4 ) { // LITERAL
            let literalDone = false;
            let literalBinaryString = "";

            while( !literalDone ) {
                literalDone = bitStream.getBits(1) === 0;
                literalBinaryString += bitStream.getBits(4).toString(2).padStart(4, "0");
            }

            packet.literal = parseInt(literalBinaryString, 2);
            // console.log( "Literal found : " + literalBinaryString, packet.literal );
        }
        else { // operator
            const lengthType = bitStream.getBits(1);
            if ( lengthType === 0 ){
                const subPacketLength = bitStream.getBits(15);

                const startingBitOffset = bitStream.getCurrentOffsetInBits();
                while( bitStream.getCurrentOffsetInBits() - startingBitOffset < subPacketLength ) {
                    // console.log("Parsing subpacket by length", bitStream.getCurrentOffsetInBits() - startingBitOffset, subPacketLength);
                    packet.subPackets.push( parsePacket(bitStream) );
                    // console.log("Done parsing subpacket by length", bitStream.getCurrentOffsetInBits());
                }
            }
            else {
                const subPacketCount = bitStream.getBits(11);
                for( let packetNr = 0; packetNr < subPacketCount; ++packetNr ) {
                    // console.log("Parsing subpacket by nr", packetNr);
                    packet.subPackets.push( parsePacket(bitStream) );
                }
            }

            const literals = packet.subPackets.map( (p) => p.literal );

            if ( packet.type === 0 ) { // sum
                packet.literal = literals.reduce( (a,b) => a + b, 0 );
            }
            else if ( packet.type === 1 ) { // product
                packet.literal = literals.reduce( (a,b) => a * b, 1 );
            }
            else if ( packet.type === 2 ) { // minimum
                packet.literal = Math.min( ...literals );
            }
            else if ( packet.type === 3 ) { // maximum
                packet.literal = Math.max( ...literals );
            }
            else if ( packet.type === 5 ) { // gt
                packet.literal = (packet.subPackets[0].literal > packet.subPackets[1].literal) ? 1 : 0;
            }
            else if ( packet.type === 6 ) { // lt
                packet.literal = (packet.subPackets[0].literal < packet.subPackets[1].literal) ? 1 : 0;
            }
            else if ( packet.type === 7 ) { // eq
                packet.literal = (packet.subPackets[0].literal === packet.subPackets[1].literal) ? 1 : 0;
            }
        }

        return packet;
    }

    function execute1(bitStream:BitStream):void {

        const packets:Array<Packet> = [];
        parsePackets( bitStream, packets );

        const sumVersions = function(packets:Array<Packet>):number {
            let output = 0;
            for ( let packet of packets ) {
                output += packet.version;
                output += sumVersions( packet.subPackets );
            }
            return output;
        }

        console.log( "All packets", JSON.stringify(packets, null, 4) );
        console.log( "Version sum", sumVersions(packets)); // should be 891
    }
    
    function execute2(bitStream:BitStream):void {
        const packets:Array<Packet> = [];
        parsePackets( bitStream, packets );

        console.log( "All packets", JSON.stringify(packets, null, 4) );
        console.log("Outer value", packets[0].literal ); // should be 673042777597
    }
    
    
    
    const input = `A20D74AFC6C80CEA7002D4009202C7C00A6830029400F500218080C3002D006CC2018658056E7002DC00C600E75002ED6008EDC00D4003E24A13995080513FA309482649458A054C6E00E6008CEF204BA00B080311B21F4101006E1F414846401A55002F53E9525B845AA7A789F089402997AE3AFB1E6264D772D7345C6008D8026200E41D83B19C001088CB04A294ADD64C0129D818F802727FFF3500793FFF9A801A801539F42200DC3801A39C659ACD3FC6E97B4B1E7E94FC1F440219DAFB5BB1648E8821A4FF051801079C379F119AC58ECC011A005567A6572324D9AE6CCD003639ED7F8D33B8840A666B3C67B51388440193E003413A3733B85F2712DEBB59002B930F32A7D0688010096019375300565146801A194844826BB7132008024C8E4C1A69E66108000D39BAD950802B19839F005A56D9A554E74C08028992E95D802D2764D93B27900501340528A7301F2E0D326F274BCAB00F5009A737540916D9A9D1EA7BD849100425D9E3A9802B800D24F669E7691E19CFFE3AF280803440086C318230DCC01E8BF19E33980331D631C593005E80330919D718EFA0E3233AE31DF41C67F5CB5CAC002758D7355DD57277F6BF1864E9BED0F18031A95DDF99EB7CD64626EF54987AE007CCC3C4AE0174CDAD88E65F9094BC4025FB2B82C6295F04100109263E800FA41792BCED1CC3A233C86600B48FFF5E522D780120C9C3D89D8466EFEA019009C9600A880310BE0C47A100761345E85F2D7E4769240287E80272D3CEFF1C693A5A79DFE38D27CCCA75E5D00803039BFF11F401095F714657DC56300574010936491FBEC1D8A4402234E1E68026200CC5B8FF094401C89D12E14B803325DED2B6EA34CA248F2748834D0E18021339D4F962AB005E78AE75D08050E10066114368EE0008542684F0B40010B8AB10630180272E83C01998803104E14415100623E469821160`;
    
    execute(input);
}