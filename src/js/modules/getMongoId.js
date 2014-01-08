//  Sigma.getMongoId module

//  Get mongoDB's id of new content
module.exports = function () {
  Sigma.socket.on('mongoId', function (data) {
    Sigma.changeId(data.tempId, data.id, data.type);
  });
};