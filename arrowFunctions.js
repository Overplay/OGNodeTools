/**
 * Created by mkahn on 1/18/17.
 */

// So, arrow functions work in your node if you get [1,4,9...]

var arr = [1,2,3,4,5,6];

var squares = arr.map( v => v**2);

console.log(squares);