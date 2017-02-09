#!/usr/bin/env node
var fs = require('fs'),
    path = require('path');

var xpath = require('../');
var argv = require('yargs').argv;
var clc = require('cli-color');

if(argv._.length!==1){
  console.log(clc.red('[Error]: argument error'));
  console.log(clc.red('eg. $ xpath-stream "//root/node()" < test.xml or $ cat test.xml | xpath-stream "//root/node()"'));
  console.log(clc.red('OR $ xpath-stream --namespace=ns:http://example.com/ns "//ns:item[ns:id=\'5A23\']" < test.xml'));
}else{
  var namespace = null;
  if(argv.namespace!=undefined){
    namespace = {};
    var kv = argv.namespace.split(":");
    var k = kv.shift();
    namespace[k] = kv.join(':');
  }
  process.stdin
    .pipe(xpath(argv._[0],null,namespace))
  .on('data',function(data){
    if(typeof data === 'string'){
      console.log(data.toString());
    }else{
      if(data.hasOwnProperty('length')){
        console.log(JSON.stringify(data.map(function(o){return o.toString()})));
      }else{
        console.log(data.toString());
      }
    }
  })
  .on('error',function(e){
    console.log(e);
  })
}
