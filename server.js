//  Sigma.io

//  (c) 2014 Davy Duperron
//  Server side

"use strict";

//  Main app
var Sigma = {},
    express = require('express');

//  Main dependencies
Sigma.app = express();
Sigma.server = require('http').createServer(Sigma.app);
Sigma.io = require('socket.io').listen(Sigma.server);
Sigma.mongo = require('mongodb').MongoClient;
Sigma.crypto = require('crypto');

//  Set template engine to jade
Sigma.app.set('view engine', 'jade');
//  Enable cache for template engine
Sigma.app.enable('view cache');
//  Set public folder
Sigma.app.use('/public', express.static('public'));
//  Use Gzip in express
Sigma.app.use(express.compress());

//  Internal dependencies
Sigma.routes = require('./modules/routes.js');
Sigma.database = require('./modules/database.js');
Sigma.websockets = require('./modules/websockets.js');

//  Socket.io settings
Sigma.io.enable('browser client minification');
Sigma.io.enable('browser client gzip');
Sigma.io.set('log level', 1);

//  Utils
Sigma.getHash = function(data) {
  var hash = Sigma.crypto.createHash('md5').update(data).digest('hex');
  return hash;
};

//  Basic error message
Sigma.errorMessage = 'Something went wrong server-side!';

//  Create an empty channel during app init and set number of results to display
Sigma.channel = {
  name : '',
  results : 10
};

//  Init database connection
Sigma.database.call(Sigma);

//  Init routes
Sigma.routes.call(Sigma);

//  Set listening port
Sigma.server.listen(80);
