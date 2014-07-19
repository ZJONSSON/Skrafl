## Skraflhjálp (Scrabble Helper)

A node.js fork/rewrite of an [Icelandic Scrabble Helper](https://github.com/vthorsteinsson/Skrafl) that uses combinations of alphabetical sorted letters instead of permutations to find all possible word combinations for a set of letters. 

* Install node.js
* run `npm install` in the project directory to install express (if intention is to run as standalone server)
* run `node index` to start the server
* See the code in action at `http://localhost:5000`

The code also exports the lookup function for reuse.

Speed benchmarks:
* vegavinnu: 1ms
* vegavinnuverka: 18ms
* vegavinnuverkamanna: 480ms
* vegavinnuverkamannaskúr: 9.7s

