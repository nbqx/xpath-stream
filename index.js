var Dom = require('xmldom').DOMParser,
    xpath = require('xpath'),
    through2 = require('through2'),
    _map = require('lodash.map'),
    _reduce = require('lodash.reduce');

module.exports = main;

function getValue(xp,doc){
  var ret =  _map(xpath.select(xp,doc),function(n){
    // text
    if(n.data!==undefined){
      return n.toString()
    }
    // attribute
    else if(n.value!==undefined){
      return n.value
    }
    else{
      return n
    }
  });

  if(ret.length===1){
    return ret[0]
  }else{
    return ret
  }
};

function main(){
  var args = [].slice.call(arguments);
  var p1 = args[0];
  var p2 = args[1];
  var buf = [];

  return through2.obj(function(c,e,next){
    buf.push(c+'');
    next();
  },function(){
    
    var result;
    var xml = buf.join();
    var doc = new Dom().parseFromString(xml);

    if(p2===undefined){
      result = getValue(p1,doc);
    }
    else{
      result = _map(getValue(p1,doc),function(o){
        return _reduce(p2,function(m,v,k){
          m[k] = getValue(v,o);
          return m
        },{});
      });
    }

    this.push(result);
    this.push(null);
  });

};
