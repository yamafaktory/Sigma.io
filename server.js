//  Sigma.io

//  (c) 2013 Davy Duperron
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

//  Set teplate engine to jade and set public folder
Sigma.app.set('view engine', 'jade');
Sigma.app.use('/public', express.static('public'));

//  Internal dependencies
Sigma.routes = require('./modules/routes.js');
Sigma.database = require('./modules/database.js');
Sigma.websockets = require('./modules/websockets.js');

//  Use Gzip in express
Sigma.app.use(express.compress());

//  Socket.io settings
Sigma.io.enable('browser client minification');
//Sigma.io.enable('browser client gzip');
Sigma.io.set('log level', 1);

//  Utils
Sigma.getHash = function(data) {
  var hash = Sigma.crypto.createHash('md5').update(data).digest('hex');
  return hash;
};

//  Basic error message
Sigma.errorMessage = 'Something went wrong server-side!';

//  Create an empty channel during app init
Sigma.channel = {
  name : '',
  results : 10
};

//  Init database connection
Sigma.database.init(Sigma);

//  Init routes
Sigma.routes.init(Sigma);

//  Set listening port
Sigma.server.listen(1337);
