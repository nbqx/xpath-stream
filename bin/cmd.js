#!/usr/bin/env node
var fs = require('fs'),
    path = require('path');

var xpath = require('../');
var argv = require('yargs').argv;
var clc = require('cli-color');

if(argv._.length!==1){
  console.log(clc.red('[Error]: argument error'));
  console.log(clc.red('eg. $ xpath-stream "//root/node()" < test.xml or $ cat test.xml | xpath-stream "//root/node()"'));
}else{
  process.stdin
    .pipe(xpath(argv._[0]))
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
}
