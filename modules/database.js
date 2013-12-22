//  Sigma.io

//  Database module
exports.init = function (Sigma) {

  //  Mongo connection
  Sigma.mongo.connect('mongodb://yamafaktory:c0un3tt3@dharma.mongohq.com:10076/Sigma', function(error, database) {
    if (error) {
      throw error;
    } else {
      Sigma.database = database;
      Sigma.objectId = require('mongodb').ObjectID;
    }
  });
  
};