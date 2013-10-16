/*
 * Sigma.io
 * (c) 2013 Davy Duperron
 * 
 * Server side
 */

"use strict";

//  Main app
var Sigma = {},
    express = require('express'),
    mongoose = require('mongoose');

//	Dependencies
Sigma.app = express();
Sigma.server = require('http').createServer(Sigma.app);
Sigma.io = require('socket.io').listen(Sigma.server);
Sigma.crypto = require('crypto');

//  Set teplate engine to jade and set public folder
Sigma.app.set('view engine', 'jade');
Sigma.app.use('/public', express.static('public'));

//  Use Gzip in express
Sigma.app.use(express.compress());

//  Socket.io settings
Sigma.io.enable('browser client minification');
//Sigma.io.enable('browser client gzip');
Sigma.io.set('log level', 1);

//  Create an empty route during app init
Sigma.id = "";

//  Mongo connection
Sigma.mongo = {};
Sigma.mongo.database = mongoose.createConnection('mongodb://xxxxxxxxxxx');

//  Mongo Schemas
var dataSchema = new mongoose.Schema({
  html : { type: String },
  owner : { type: String },
  date  : { type: Date, default: Date.now }
}, { autoIndex: false });

var channelSchema = new mongoose.Schema({
  name  : { type: String, unique: true },
  data  : [dataSchema],
  date  : { type: Date, default: Date.now }
}, { autoIndex: false });

var userSchema = new mongoose.Schema({
  username  : { type: String, unique: true },
  password  : { type: String },
  date  : { type: Date, default: Date.now }
}, { autoIndex: false });

var imageSchema = new mongoose.Schema({
  source  : { type: String }
}, { autoIndex: false });


//  Mongo models
Sigma.mongo.Channel = Sigma.mongo.database.model('Channel', channelSchema);
Sigma.mongo.User = Sigma.mongo.database.model('User', userSchema);
Sigma.mongo.Image = Sigma.mongo.database.model('Image', imageSchema);

//  Routes
//    Channels
Sigma.app.get('/:id', function (req, res) {
  Sigma.id = req.params.id;
  res.render('index', { id: Sigma.id });
});
//    Images
Sigma.app.get('/data/:id', function (req, res) {
  //  Find image source
  Sigma.mongo.Image.findById(req.params.id, function (error, document) {
    if (error || document == null) {
      res.sendfile(__dirname + '/public/img/404.svg');
    } else {
      res.set('Content-Type', 'image/png');
      res.send(new Buffer(document.source, 'base64'));
    }
  });
});

//  Set listening port
Sigma.server.listen(1337);

//  Utils
Sigma.getHash = function(data) {
  var hash = Sigma.crypto.createHash('md5').update(data).digest('hex');
  return hash;
};

//  Socket.io
Sigma.io.sockets.on('connection', function (socket) {

  //  Join route as room
  socket.join(Sigma.id);

  //  Find if database is already populated for that channel
  Sigma.mongo.Channel.findOne({ 'name': Sigma.id }, function (error, document) {
    if (document){
      //  If channel already exists
      Sigma.mongo.Channel.aggregate(
        { $match : { name : Sigma.id } },
        { $project: { data: 1 } },
        { $unwind: '$data' },
        { $sort: { 'data.date': -1 } },
        { $limit: 9 },
        { $sort: { 'data.date': 1 } },
        function (error, documents) {
          if (error) {
            console.log(error);
          } else {
            //  Then send it as history if not empty
            if (documents.length !== 0){
              socket.emit('history', { empty: false, documents: documents });
            } else {
              socket.emit('history', { empty: true });
            }
          }
        }
      );
    } else {
      //  Create an empty channel
      var channel = new Sigma.mongo.Channel();
      channel.name = Sigma.id;
      channel.save(function (error) {
        if (error) {
          console.log(error);
        } else {
          socket.emit('history', { empty: true });
        }
      });
    }
  });

  //  Send current id to client
  socket.emit('id', { data: Sigma.id });

  //  If client is sending data
  socket.on(Sigma.id, function (data) {
    Sigma.mongo.Channel.findOne({ 'name': Sigma.id }, function (error, document) {
      if (error) {
        socket.emit('socketMessage', { message: 'Something goes wrong server-side!', type: false });
      } else {
        switch (data.action) {
          //  Create new content
          case 'create':
            var newData = document.data.create({ html: data.html, owner: data.owner });
            document.data.push(newData);
            document.save(function (error) {
              if (error) {
                socket.emit('socketMessage', { message: 'Something goes wrong server-side!', type: false });
              } else {
                //  Broadcast changes to channel
                socket.broadcast.to(Sigma.id).emit('broadcast', { action: 'create', html: data.html, id: newData._id });
                //  Send new content id's to client
                socket.emit('mongoId', { tempId: data.mongoId, id: newData._id, type: 'article' });
              }
            });
            break;
          //  Update content
          case 'update':
            //  Broadcast changes to channel
            socket.broadcast.to(Sigma.id).emit('broadcast', { action: 'update', html: data.html, id: data.mongoId });
            //  Update content
            document.data.id(data.mongoId).html = data.html;
            document.save(function (error) {
              if (error) {
                socket.emit('socketMessage', { message: 'Something goes wrong server-side!', type: false });
              }
            });
            break;
          //  Delete content
          case 'delete':
            document.data.id(data.mongoId).remove();
            document.save(function (error) {
              if (error) {
                socket.emit('socketMessage', { message: 'Something goes wrong server-side!', type: false });
              } else {
                //  Broadcast changes to channel
                socket.broadcast.to(Sigma.id).emit('broadcast', { action: 'delete', id: data.mongoId });
              }
            });
            break;
        }
      }
    });
  });

  //  If a user is trying to sign in
  socket.on('signIn', function (data) {
    Sigma.mongo.User.findOne({ 'username': data.username }, function (error, document) {
      if (error) {
        socket.emit('socketMessage', { message: 'Something is going wrong with your connection!', type: false });
      } else {
        if (document) {
          console.log(document.password+'    '+data.password);
          if (document.password === data.password) {
            //  If username & password are ok
            socket.emit('isConnected', { username: data.username });
          } else {
            socket.emit('socketMessage', { message: 'Wrong password!', type: false });
          }
        } else {
          // Offer to create new user
          socket.emit('signUp', { username: data.username });
        }
      } 
    });
  });

  //  If a user is trying to sign up
  socket.on('signUp', function (data) {
    //  Save user
    var user = new Sigma.mongo.User();
    user.username = data.username;
    user.password = data.password;
    user.save();
    //  Then connect user
    socket.emit('isConnected', { username: data.username });
  });

  //  If a client want to store an image
  socket.on('storeImage', function (data) {
    var image = new Sigma.mongo.Image();
    //  Slice and decode dataURL
    var dataURL = new Buffer(data.src),
        source = dataURL.toString('utf8', 22);
    //  Save it
    image.source = source;
    image.save(function (error) {
      if (error) {
        console.log(error);
      } else {
        //  Send new content id's to client
        socket.emit('mongoId', { tempId: data.tempId, id: image._id, type: 'image' });
      }
    });
  });

  //  If a client want to delete an image
  socket.on('deleteImage', function (data) {
    var ids = data.ids,
        returnIds = ids,
        removeImage = function (id) {
          Sigma.mongo.Image.remove({ _id: id }, function (error) {
            if (error) {
              socket.emit('socketMessage', { message: 'Something goes wrong server-side!', type: false });
            } else {
              //  Remove id from the array to be sent to the client
              returnIds.splice(returnIds.indexOf(id), 1);
              // Update the original array on client
              socket.emit('updateImageArray', { array: returnIds });
            }
          });
        };
    ids.forEach(function (id) {
      removeImage(id);
    });
  });

});
