/**
 * Created by mkahn on 2/7/17.
 */

app.controller("tvScreenController", function($scope, $log, simService){

    $log.debug("loading tvScreenController");
    
    $scope.message = "Hello!";
    
    simService.registerCallback(function(serviceData){
        $log.debug("Changing channel to: "+serviceData);
    });

});