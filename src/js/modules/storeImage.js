//  Sigma.storeImage module

//  Store image in mongoDB
module.exports = function (tempId, smallImage, largeImage) {
  Sigma.socket.emit('storeImage', { tempId: tempId, smallImage: smallImage, largeImage: largeImage });
};