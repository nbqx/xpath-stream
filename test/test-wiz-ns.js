var test = require('tape');
var xpath = require('..');

// string stream
var Readable = require('stream').Readable;
function testStream(str){
  var stream = new Readable({objectMode:true});
  stream.push(str);
  stream.push(null);
  return stream
};

var xml = [
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
].join('');

test('xpath parse error',function(t){
  testStream(xml)
    .pipe(xpath("//ns:item/ns:name/",null,{"ns": "http://example.com/test"}))
    .on('error',function(e){
      t.ok(e.message,'XPath parse error');
      t.end();
    });
});

test('text node',function(t){
  testStream(xml)
    .pipe(xpath("//ns:item/ns:name/text()",null,{"ns": "http://example.com/test"}))
    .on('data',function(data){
      t.ok(data.indexOf('item1')>-1,'has item1');
      t.ok(data.indexOf('item2')>-1,'has item2');
      t.end();
    });
});

test('attribute value',function(t){
  testStream(xml)
    .pipe(xpath("//ns:item/@ns:id",null,{"ns": "http://example.com/test"}))
    .on('data',function(data){
      t.ok(data.indexOf('1')>-1,'has 1');
      t.ok(data.indexOf('2')>-1,'has 2');
      t.end();
    });
});

test('xmldom object',function(t){
  testStream(xml)
    .pipe(xpath("//ns:item",null,{"ns": "http://example.com/test"}))
    .on('data',function(data){
      t.notOk(typeof data[0] === 'string','should be Object');
      t.end();
    });
});

test('object',function(t){
  testStream(xml).pipe(xpath("//ns:item",{
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
    t.deepEqual(node[0],{
      id: "1",
      type: "001",
      name: "item1",
      price: "5000",
      nest: {
        data: "nested",
        data2: "nested2",
        deepNest: {
          deepData: "nested2"
        }
      }
    });
    t.end();
  });
});
