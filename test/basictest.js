var pako = require("pako")
var nj = require("numjs")
var jd = require("../jdata.js")


let a={integer:1,shortarray:[1,2,3],object:[[1,2,3],null,false]};
a.a_typedarray=new Uint8ClampedArray([9,9,9,9]);
a.a_ndarray=nj.arange(3*3,'int32').reshape(3,3);
a.a_map=new Map([
  [1, 'one'],
  [2, 'two'],
  ["k", 'three'],
]);

jd= new jdata(a,{compression:'zlib'});

console.log(jd.tojson());
console.log(jd.encode().tojson());
console.log(jd.encode().decode().tojson());


//document.getElementById('orig').innerHTML=jd.tojson();
//document.getElementById('jdata').innerHTML=jd.encode().tojson();
//document.getElementById('decoded').innerHTML=jd.encode().decode().tojson();
