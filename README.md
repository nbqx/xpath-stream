## xpath-stream

xpath transform stream

## Install

    $ npm install xpath-stream

## Usage

```js
var xpathStream = require('xpath-stream');

// string stream
var Readable = require('stream').Readable;
function testStream(str){
  var stream = new Readable({objectMode:true});
  stream.push(str);
  stream.push(null);
  return stream
};

var xml = testStream([
'<items>',
  '<item id="1"><name type="001">item1</name><price>5000</price></item>',
  '<item id="2"><name type="002">item2</name><price>1000</price></item>',
'</items>'].join(''));

// text node
xml
  .pipe(xpathStream("//item/name/text()"))
  .on('data',console.log);

// attribute value
xml
  .pipe(xpathStream("//item/@id"))
  .on('data',console.log);

// xmldom object
xml
  .pipe(xpathStream("//item"))
  .on('data',console.log);

// object
xml.pipe(xpathStream("//item",{
  id: "./@id",
  type: "name/@type",
  name: "name/text()",
  price: "price/text()"
}))
.on('data',function(node){
  console.log(node);
});
```
