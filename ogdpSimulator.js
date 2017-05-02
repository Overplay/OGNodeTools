/**
 * Created by mkahn on 1/23/17.
 */

/**
 * Created by mkahn on 9/22/16.
 */

var dgram = require( 'dgram' );
var server = dgram.createSocket( 'udp4' );

var fauxGs = [];

var planets = [ 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Ceres', 'Pluto', 'Saturn', 'Europa', 'Moon', 'Uranus', 'Neptune', 'Charon' ]

function FauxG( name, location ) {

    this.name = name || "No Name";
    this.locationWithinVenue = location || "No Location";
    this.randomFactoid = "Bunnies are cute";

    this.message = JSON.stringify( this )

    this.announce = function (ipaddr) {

        console.log( "Sending: " + this.message );
        var _that = this;
        server.send( this.message, 0, this.message.length, 9091, ipaddr, function ( err ) {
            console.error( "Sent udp from: " + _that.location )
        } );
    }

}

server.on( 'error', function ( err ) {
    console.log( 'server error:\n' + err.stack );
    server.close();
} )


server.on( 'message', function ( msg, rinfo ) {
    console.log( 'server got: ' + msg + ' from ' + rinfo.address + ':' + rinfo.port );

    fauxGs.forEach( function ( fg ) {
        fg.announce(rinfo.address);
    } )

} )


server.on( 'listening', function () {
    var address = server.address();
    console.log( 'server listening ' + address.address + ':' + address.port );
} )


server.bind( 9091 );

planets.forEach( function ( p ) {
    fauxGs.push( new FauxG( "Simulated", p ) );
} )
