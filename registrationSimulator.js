/**
 * Created by mkahn on 5/1/17.
 */

var uuid = require('uuid/v1');
var request = require( 'superagent-bluebird-promise' );
var Promise = require('bluebird');


function initialRegistration(){

    return request.post('http://138.68.230.239:2001/ogdevice/register')
        .send({ deviceUDID: uuid() })
        .then( function(response){
            //console.log("Got: "+ response.body);
            return response.body;
        });

}

function getCodeForDevice(device){

    return request.post( 'http://138.68.230.239:2001/ogdevice/regcode' )
        .send( { deviceUDID: device.deviceUDID } )
        .then( function ( response ) {
            //console.log( "Got: " + response.body );
            return response.body;
        } );

}


initialRegistration()
    .then( function(device){

        console.log("registered");
        return getCodeForDevice(device);

    })
    .then( function(code){
        console.log("Reg code is: "+ code.code);
    })
    .catch( function(err){
        console.log(err.message);
    })