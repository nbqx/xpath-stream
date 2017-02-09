var xpathStream = require('./');

// string stream
var Readable = require('stream').Readable;
function testStream(str){
  var stream = new Readable({objectMode:true});
  stream.push(str);
  stream.push(null);
  return stream
};

var xml = testStream([
'<items xmlns:ns="http://example.com/test">',
  '<ns:item ns:id="1">',
    '<ns:name ns:type="001">item1</ns:name>',
    '<ns:price>5000</ns:price>',
    '<ns:nest>',
      '<ns:data>nested</ns:data>',
      '<ns:nest2><ns:data>nested2</ns:data></ns:nest2>',
    '</ns:nest>',
  '</ns:item>',
  '<ns:item ns:id="2"><ns:name ns:type="002">item2</ns:name><ns:price>1000</ns:price></ns:item>',
'</items>'
].join(''));

// text node
// xml
//   .pipe(xpathStream("//ns:item/ns:name/text()",null,{"ns": "http://example.com/test"}))
//   .on('data',console.log)
//   .on('error',console.log)

// attribute value
// xml
//   .pipe(xpathStream("//ns:item/@ns:id",null,{"ns": "http://example.com/test"}))
//   .on('data',console.log);

// xmldom object
// xml
//   .pipe(xpathStream("//ns:item",null,{"ns": "http://example.com/test"}))
//   .on('data',console.log);

// object
xml.pipe(xpathStream("//ns:item",{
  id: "./@ns:id",
  type: "ns:name/@ns:type",
  name: "ns:name/text()",
  price: "ns:price/text()",
  nest: {
    data: "ns:nest/ns:data/text()",
    data2: "ns:nest/ns:nest2/ns:data/text()",
    deepNest: {
      deepData: "ns:nest/ns:nest2/ns:data/text()"
    }
  }
},{"ns": "http://example.com/test"}))
.on('data',function(node){
  console.log(JSON.stringify(node));
});
