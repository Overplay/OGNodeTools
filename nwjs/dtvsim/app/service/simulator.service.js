/**
 * Created by mkahn on 2/7/17.
 */

app.factory( "simService", function ( $log ) {

    var service = {};

    var os = require( 'os' );
    var colors = require( 'colors' );
    var keypress = require( 'keypress' );

    var myIp = getIPAddresses()[ 0 ];  // brittle, but whatever
    var VERBOSE = true;

    var Server = require( 'node-ssdp' ).Server;

    //Lets require/import the HTTP module
    var http = require( 'http' );
    
    var cb;

    //Lets define a port we want to listen to
    const PORT = 8080;  // This is hardwired into the DirecTV API, so make sure nothing else is on this port on your
                        // system


    function logv( msg ) {
        if ( VERBOSE ) {
            console.log( msg );
        }
    }

    function getIPAddresses() {

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


    var server = new Server( {
        ssdpSig:  "Linux/2.6.18.5, UPnP/1.0 DIRECTV JHUPnP/1.0",
        location: "http://" + getIPAddresses() + ":9900/upnp/desc.xml"
    } );


    server.addUSN( 'upnp:rootdevice' );
    server.addUSN( 'urn:schemas-upnp-org:device:MediaServer:1' );


    server.on( 'advertise-alive', function ( headers ) {
        // Expire old devices from your cache.
        // Register advertising device somewhere (as designated in http headers heads)
    } );

    server.on( 'advertise-bye', function ( headers ) {
        // Remove specified device from cache.
    } );


    // start the server
    server.start();

    process.on( 'exit', function () {
        server.stop() // advertise shutting down and stop listening
    } )

    //Create a server
    var httpserver = http.createServer( function ( request, response ) {

        var url = request.url;

        //Return the goofy XML SSDP description file
        if ( url.indexOf( 'xml' ) > -1 ) {
            console.log( "Dumping XML description back to inquirer" );
            var fs = require( 'fs' );
            fs.readFile( "dtvresponse.xml", "utf-8", function ( err, data ) {
                response.end( data );
            } );
        } else if ( url.indexOf( "getTuned" ) > -1 ) {
            console.log( "Returning tuning info" );
            response.end( JSON.stringify( getChannelInfo() ) );
        } else if ( url.indexOf( "getVersion" ) > -1 ) {
            console.log( "Returning uid info" );
            response.end( JSON.stringify( { receiverId: "fake-receiver-yo" } ) );
        } else if ( url.indexOf( "tv/tune" ) > -1 ) {
            console.log( "Tuning" );
            var parms = url.split('?')[1].split('=');
            console.log("Channel: "+parms[1]+" from URL: "+url);
            if (cb)
                cb(parms[1]);
            response.end( JSON.stringify( { channel: parms } ) );
        } else {
            response.writeHead( 400, 'No such route', { 'content-type': 'text/plain' } );
            response.end( "Bad route, homie!" );
        }
    } );

    //Lets start our server
    httpserver.listen( PORT, function () {
        //Callback triggered when server is successfully listening. Hurray!
        console.log( "Server listening on: http://localhost:%s", PORT );
    } );

    var channelIdx = 0;

    function getChannelInfo() {
        return channelInfo[ channelIdx ];
    }

    var channelInfo = [
        {
            callsign:  "ESPNHD",
            major:     206,
            minor:     65535,
            programId: 36417953,
            stationId: 2220255,
            title:     "Yoga Caliente"
        },
        { callsign: "CNNHD", major: 202, minor: 65535, programId: 36417952, stationId: 2220225, title: "News & Stuff" },
        { callsign: "BEIN", major: 620, minor: 65535, programId: 3617953, stationId: 220255, title: "Soccer is Dull" },
        { callsign: "FOX", major: 2, minor: 65535, programId: 3647953, stationId: 20255, title: "FOXy Show" }
    ];

    function regCB(callback){
        cb = callback;
    }

    return {
        registerCallback:  regCB
    };

} );