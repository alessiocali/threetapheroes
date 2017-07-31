var tokens = require('./_token.js');
var static = require('node-static');

try {
    var file = new static.Server();
    require('http').createServer(function(request, response) {
      request.addListener('end', function() {
        file.serve(request, response);
      }).resume();
    }).listen(tokens.PORT || tokens.DEFAULT_PORT);
}
catch(e) {
    console.log(e);
}