// npm install atob btoa pako numjs
// node ./basictest.js

var pako = require("pako")
var nj = require("numjs")
var jdata = require("../jdata.js")
global.atob = require("atob");
global.btoa = require("btoa");


let data={integer:1,shortarray:[1,2,3],object:[[[1],[2],[3]],null,false]};
data.special=[NaN, Infinity, -Infinity,[],{}];
data.a_typedarray=new Uint8ClampedArray([9,9,9,9]);
data.a_ndarray=nj.arange(3*3,'int32').reshape(3,3);
data.a_buffer=new ArrayBuffer(16);
data.a_biginteger=9007199254740991n;
data.a_bigintarray=BigUint64Array.from([9007199254740991n,347523475237452n]);
data.a_map=new Map([
  [0/0, 'one'],
  [2, 'two'],
  ["k", 'three'],
]);

jd= new jdata(data,{compression:'zlib'});

console.log(jd.tojson());
console.log(jd.encode().tojson());
console.log(jd.encode().decode().tojson());


//document.getElementById('orig').innerHTML=jd.tojson();
//document.getElementById('jdata').innerHTML=jd.encode().tojson();
//document.getElementById('decoded').innerHTML=jd.encode().decode().tojson();
