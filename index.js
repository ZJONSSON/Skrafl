var fs = require('fs'),
    scoring = {};

// set up scoring
[
  ['a','e','i','n','r','s','t','u'],
  ['ð','k','l','m','o','g'],
  ['v','f','h'],
  ['d','þ','á','í'],
  ['æ','j'],
  ['é','ó','b'],
  ['y','ö'],
  ['p','ú'],
  'ý',
  'x'
].forEach(function(set,i) {
  [].concat(set).forEach(function(letter) {
    scoring[letter] = i+1;
  });
});

// load wordlists
var words = {};

console.log('Loading');
(fs.readFileSync('./resources/ordalisti1.txt','utf-8')+
fs.readFileSync('./resources/ordalisti2.txt','utf-8')+
fs.readFileSync('./resources/smaordalisti.txt','utf-8'))
  .replace(/\r/g,'')
  .split('\n')
  .filter(function(d) {
    return d.length;
  })
  .forEach(function(word,i) {
    var letters = word.split('').sort(),
        key = letters.join('');
    
    words[key] = words[key] || {
      score : letters
        .reduce(function(p,c) {
          return p+scoring[c];
        },0),
      results : []
    };
    
    words[key].results.push(word);
    if (i % 1000 === 0) process.stdout.write('.');
  });

console.log('Ready');

// provide combinatory lookup
function lookup(letters) {
  var res = {},
      n = letters.length,
      i=0;

  letters = letters.split('').sort();

  function comb(c) {
    function bitprint(u) {
      var s = '';
      for (var n=0; u; ++n, u>>=1)
        if (u&1) s+=letters[n];
      return s;
    }

    function bitcount(u) {
      for (var n=0; u; ++n, u=u&(u-1));
      return n;
    }

    for (var u=0; u<1<<n; u++)
      if (bitcount(u)==c) {
        var key = bitprint(u);
        if (words[key]) res[key] = words[key];
      }
  }

  while (i++ < letters.length)
    comb(i);

  return Object.keys(res)
    .map(function(key) {
      return res[key];
    })
    .sort(function(a,b) {
      return b.score - a.score;
    });
}

// Simple webserver provided for standalone execution
if (!module.parent) {
  var express = require('express');
  express()
    .use(express.bodyParser())
    .all('/',function(req,res,next) {
      var stafir = req.body.stafir || '',
          time = new Date(),
          results = lookup(stafir).map(function(d) {
            return d.score+': '+d.results.join(',');
          }).join('<br>');

      res.write('<html><meta charset="utf-8"><form action="/" method="post">Word:<input type="text" name="stafir" value ="'+(stafir||'')+'"><button type="submit">Send</button></form><hr>');
      res.end( 'Lookup duration: '+Math.floor(new Date()-time)+' ms<hr>'+results);
    })
    .listen(5000);

  console.log('Listening on port 5000');
}

// otherwise just export the lookup function
module.exports = lookup;