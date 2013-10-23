//  Sigma.io

//  Database module
exports.init = function (Sigma) {
  //  Mongo connection
  Sigma.mongo.connect('mongodb://xxxxxxxxxx', function(error, database) {
    if (error) {
      throw error;
    } else {
      Sigma.database = database;
      Sigma.objectId = require('mongodb').ObjectID;
    }
  });
};