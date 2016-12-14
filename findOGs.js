/**
 * Created by mkahn on 11/16/16.
 */

// Sends out the OG inquiry packets and then shows the attached systems

var dgram = require('dgram');
var server = dgram.createSocket( 'udp4' );
var os = require( 'os' );
var colors = require( 'colors' );

var foundOGs;
var myIp = getIPAddresses()[0];  // brittle, but whatever
var VERBOSE = false;

function logv(msg){
    if (VERBOSE){
        console.log(msg);
    }
}

function sendPingFrom(ipAddress){

    var pingMsg = JSON.stringify( { ip: ipAddress, action: "discover", time: Date.now() } );
    server.send( pingMsg, 0, pingMsg.length, 9091, '255.255.255.255', function ( err ) {
        if (err){
            console.log("Error sending UDP ping!");
        }
    });
    
}


function getIPAddresses(){

    var interfaces = os.networkInterfaces();
    var addresses = [];
    for ( var k in interfaces ) {
        for ( var k2 in interfaces[ k ] ) {
            var address = interfaces[ k ][ k2 ];
            if ( address.family === 'IPv4' && !address.internal ) {
                addresses.push( address.address );
            }
        }
    }

    return addresses;

}

server.on( 'error', function ( err ) {
    console.log( ('server error:\n' + err.stack).red );
    server.close();
} )


server.on( 'message', function ( msg, rinfo ) {
    logv( 'server got: ' + msg + ' from ' + rinfo.address + ':' + rinfo.port );
    if ( (rinfo && rinfo.address)==myIp ){
        logv("I'm hearing my own voice.");
    } else {
        var og = JSON.parse(msg);
        console.log(("----- OG Named: "+og.name+" @ "+rinfo.address).green);
        console.log((JSON.stringify(og, null, 4)).cyan);

    }

} )


server.on( 'listening', function () {
    var address = server.address();
    console.log( ('server listening ' + address.address + ':' + address.port).magenta );
} )


server.bind( 9091, function () {
    server.setBroadcast( true );
    sendPingFrom( getIPAddresses()[ 0 ] );
    setTimeout( function(){ sendPingFrom( getIPAddresses()[0])}, 1000);
    setTimeout(function(){
        server.close(function(){
            console.log("Waited 10 seconds, now I am out.".magenta);
        })
    }, 10000)
} );
