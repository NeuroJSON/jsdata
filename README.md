jdata.js - JData Annotation Encoder/Decoder for JavaScript and NodeJS
===========

**[JData] encoder and decoder for JavaScript and [Node.js].**

Check out the [Github repo] for the source code.
Visit [module site] for API docs and examples.
Extra information available in [wiki].

[JData]: http://neurojson.org/jdata/draft2/
[Node.js]: http://nodejs.org/

[Github repo]: https://github.com/NeuroJSON/jsdata
[module site]: https://github.com/NeuroJSON/jsdata
[wiki]: http://neurojson.org


Installation
------------


To use the `jdata.js` module in node.js applications, you must first install the below dependencies

```sh
npm install atob btoa pako numjs
```

To use jdata.js in a JavaScript application in a web browser, you must include the below dependencies
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/numjs/0.16.0/numjs.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.11/pako.min.js"></script>
```


Usage example
-------------

For NodeJS applications, 

```js
var jdata = require("../jdata.js")
var nj = require("numjs")

let data={integer:1,shortarray:[1,2,3],object:[[[1],[2],[3]],null,false]};
data.special=[NaN, Infinity, -Infinity,[],{}];      // special numbers
data.a_typedarray=new Uint8ClampedArray([9,9,9,9]); // a TypedArray
data.a_ndarray=nj.arange(3*3,'int32').reshape(3,3); // a NumJS array
data.a_buffer=new ArrayBuffer(16);                  // a buffer
data.a_biginteger=9007199254740991n;                // large numbers

let jd= new jdata(data,{compression:'zlib'});

console.log(jd.tojson());   //jdata can convert complex data to JSON
console.log(jd.encode().tojson());  // jdata can convert complex data to JData-encoded objects
console.log(jd.encode().decode().tojson());   // jdata can decode the JData-encoded objects back to native objects

```

For web-based JavaScript applications, 

```html
<script src="./js/jdata.js"></script>
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
