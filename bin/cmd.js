#!/usr/bin/env node
var fs = require('fs'),
    path = require('path');

var xpath = require('../');
var argv = require('yargs').argv;
var clc = require('cli-color');

function _view(data){
  try{
    data = data.map(function(d){ 
      return d.toString().replace(/\r\n|\r|\n|\t/g,'')
    }).filter(function(d){return d!==''});
    console.log(data.join("\n"));
  }catch(x_x){
    console.log(clc.red('[Error]: xpath error'));
  }
};

if(process.stdin.isTTY){
  if(argv._.length!==2){
    console.log(clc.red('[Error]: argument error -> eg. $ xpath-stream "//root/node()" test.xml'));
  }else{
    var pattern = argv._[0];
    var cont = fs.createReadStream(argv._[1]);
    cont.pipe(xpath(pattern)).on('data',_view);
  }
}else{
  if(argv._.length!==1){
    console.log(clc.red('[Error]: argument error -> eg. $ cat test.xml | xpath-stream "//root/node()"'));
  }else{
    var pattern = argv._[0];
    var inp = '';
    process.stdin.on('data',function(c){ inp += c});
    process.stdin.on('end',function(){
      var stream = new require('stream').Readable({objectMode:true});
      stream.push(inp);
      stream.push(null);
      stream.pipe(xpath(pattern)).on('data',_view);
    });
  }
}
