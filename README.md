jdata.js - JData Annotation Encoder/Decoder for JavaScript and NodeJS
===========

[JData specification] is a language-independent data annotation
standard that enables convenient storage and exchange of complex
data structures, such as strongly-typed binary N-D arrays, complex-valued
and sparse arrays, tables and graphs, using lightweight [JSON]
`name`:`value` pairs. This allows applications to exchange complex
data records between programming languages, such as between MATLAB,
Python and JavaScript. Both the JData specification and this library
are developed under the [NeuroJSON] project (http://neurojson.org)
funded by the U.S. National Institute of Health (NIH) grant # U24-NS124027.

Using the JData/JSON format, a strongly-typed `uint8` integer 3D array of
size `3x2x4`
```js
data=[
    [[1,7,13,19],[4,10,16,22]],
    [[2,8,14,20],[5,11,17,23]],
    [[3,9,15,21],[6,12,18,24]]
]
```
can be encoded using JData/JSON [annotated ND-array] format as
```js
data={
    _ArrayType_: "uint8",
    _ArraySize_: [3,2,4],
    _ArrayData_: [1,7,13,19,4,10,16,22,2,8,14,20,5,11,17,23,3,9,15,21,6,12,18,24]
 }
```
[JData specification] also permits data-level compression via
`_ArrayZip*_` tags, for example, the same `uint8` 3-D array can be
stored after `zip` compression (and then Base64-encoded) as
```js
data={
    _ArrayType_:"uint8",
    _ArraySize_:[3,2,4],
    _ArrayZipType_:"zlib",
    _ArrayZipSize_:[1,24],
    _ArrayZipData_:"eJxjZOcVZuESEGPi4BNh5RYUZ+bkF2XjEZIAAA1CAS0="
}
```

With the help of additional lightweight annotation tags, JData format permits
scientific applications to exchange a wide variety of complex data structures, 
including complex-valued arrays, sparse arrays, maps, tables, graphs etc, effortlessly
via JSON and binary-JSON serialized files or streams. Because JSON/binary JSON
parsers are widely available, this not only makes data human-readable and 
self-documenting, but also easily extensible and inteoperable between applications.

This lightweight `jdata.js` module provides JData-annotation encoding and decoding
functionalities for JavaScript/web applications as well as NodeJS applications. It can 
automatically recognize the JData annotation tags, such as `_ArrayType_` etc, 
and convert the encoded data to the native JavaScript/Node data structures, such as
TypedArray, ArrayBuffer, NumJS NDarray, and BigInt etc. It also performs in 
the reverse direction, i.e. encode native JavaScript data structures into JSON/JData
encoded forms that are easy to be stored in data files, databases and shared between
programming environments. Compression and decompression using `zlib`, `gzip` and `lzma`
algorithms are currently supported in this library.

Check out the [Github repo] for the source code.
Visit [module site] for API docs and examples.
Extra information available in [wiki].

[NeuroJSON]: http://neurojson.org
[JData specification]: http://neurojson.org/jdata/draft2/
[Node.js]: http://nodejs.org/
[JSON]: http://json.org
[Github repo]: https://github.com/NeuroJSON/jsdata
[module site]: https://npmjs.com/package/jda
[wiki]: http://neurojson.org
[nnotated ND-array]: https://github.com/NeuroJSON/jdata/blob/master/JData_specification.md#annotated-storage-of-n-d-arrays

Installation
------------


To use the `jdata.js` module in Node.js applications, you must first install the below dependencies

```sh
npm install jda
```

This will automatically install the jdata.js package as well as its dependencies: `atob, btoa, pako, numjs`.

To use `jdata.js` in a JavaScript application in a web browser, you must include the below dependencies
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/numjs/0.16.0/numjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.11/pako.min.js"></script>
```


Usage example
-------------

For NodeJS applications, 

```js
// import packages
var jdata = require('jda')
var nj = require('numjs')
global.atob = require("atob");
global.btoa = require("btoa");

// define sample data
let data={integer:1,shortarray:[1,2,3],object:[[[1],[2],[3]],null,false]};
data.special=[NaN, Infinity, -Infinity,[],{}];      // special numbers
data.a_typedarray=new Uint8ClampedArray([9,9,9,9]); // a TypedArray
data.a_ndarray=nj.arange(3*3,'int32').reshape(3,3); // a NumJS array
data.a_buffer=new ArrayBuffer(16);                  // a buffer
data.a_biginteger=9007199254740991n;                // large numbers

// create jdata class with compression method "zlib"
let jd = new jdata(data,{compression:'zlib'});

console.log(jd.tojson());   //jdata can convert complex data to JSON
console.log(jd.encode().tojson());  // jdata can convert complex data to JData-encoded objects
console.log(jd.encode().decode().tojson());   // jdata can decode the JData-encoded objects back to native objects

// load local JSON files and decode JData constructs
var fs = require('fs')
var mydata = new jdata(JSON.parse(fs.readFileSync('mydata.json').toString().replace(/\n/g,''))).decode();
console.log(mydata)
```

The `jda` module can also be used to decode JData annotations stored in a binary JSON
([BJData](http://neurojson.org/bjdata/draft2/)) document, one should also install the 
[binary JData encoder/decoder `bjd`](https://npmjs.com/package/bjd) via
```sh
npm install bjd
```
and then read/decode the binary JData file by
```js
// load local BJData files and decode JData constructs
var bjd = require('bjd')
var jdata = require('jda')
var fs = require('fs')

var mydata = new jdata(bjd.decode(fs.readFileSync('mydata.bjd'))[0]).decode();
console.log(mydata)
```

For web-based JavaScript applications, 

```html
<script src="./jdata.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/numjs/0.16.0/numjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.11/pako.min.js"></script>

<script>
let data={integer:1,shortarray:[1,2,3],object:[[[1],[2],[3]],null,false]};
let jd= new jdata(data,{compression:'zlib'});

console.log(jd.tojson());   //jdata can convert complex data to JSON

jd=new jdata(JSON.parse(jsonstr));
console.log(jd.decode())
</script>
```


Contributing
------------

To contribute any patches, simply fork this repository using GitHub
and send a pull request to [this project](https://github.com/NeuroJSON/jsdata). Thanks!


License
-------

BSD-3-clause license. See license text in file [LICENSE](https://github.com/NeuroJSON/jsdata/blob/master/LICENSE).
