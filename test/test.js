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
'<items>',
  '<item id="1">',
    '<name type="001">item1</name>',
    '<price>5000</price>',
    '<nest>',
      '<data>nested</data>',
      '<nest2><data>nested2</data></nest2>',
    '</nest>',
  '</item>',
  '<item id="2"><name type="002">item2</name><price>1000</price></item>',
'</items>'
].join('');

test('text node',function(t){
  testStream(xml)
    .pipe(xpath("//item/name/text()"))
    .on('data',function(data){
      t.ok(data.indexOf('item1')>-1,'has item1');
      t.ok(data.indexOf('item2')>-1,'has item2');
      t.end();
    });
});

test('attribute value',function(t){
  testStream(xml)
    .pipe(xpath("//item/@id"))
    .on('data',function(data){
      t.ok(data.indexOf('1')>-1,'has 1');
      t.ok(data.indexOf('2')>-1,'has 2');
      t.end();
    });
});

test('xmldom object',function(t){
  testStream(xml)
    .pipe(xpath("//item"))
    .on('data',function(data){
      t.notOk(typeof data[0] === 'string','should be Object');
      t.end();
    });
});

test('object',function(t){
  testStream(xml).pipe(xpath("//item",{
    id: "./@id",
    type: "name/@type",
    name: "name/text()",
    price: "price/text()",
    nest: {
      data: "nest/data/text()",
      data2: "nest/nest2/data/text()",
      deepNest: {
        deepData: "nest/nest2/data/text()"
      }
    }
  }))
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

