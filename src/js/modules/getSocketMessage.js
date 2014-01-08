//  Sigma.getSocketMessage module

//  Receive message through websockets
module.exports = function () {
  Sigma.socket.on('socketMessage', function (data) {
    Sigma.manageMessage(true, data.message, data.type);
  });
};