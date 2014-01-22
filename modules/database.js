//  Sigma.io

//  Database module
module.exports = function () {

  var Sigma = this;

  //  Mongo connection
  Sigma.mongo.connect('mongodb://sigma:demo@dharma.mongohq.com:10008/Sigma', function(error, database) {
    if (error) {
      throw error;
    } else {
      Sigma.database = database;
      Sigma.objectId = require('mongodb').ObjectID;
      //  Fire websockets only when database connection is ok
      Sigma.websockets.call(Sigma);
    }
  });
  
};