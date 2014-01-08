//  Sigma.getChannelId module

//  Collect channel id's
module.exports = function () {
  Sigma.socket.on('id', function (data) {
    Sigma.getChannelId = data.id;
    //  Then create a listener
    Sigma.listen();
  });
};