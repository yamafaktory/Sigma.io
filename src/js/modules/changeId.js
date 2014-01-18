//  Sigma.changeId module

// Change tempId to mongoId
module.exports = function (tempId, id, type) {
  var selector = '[data-mongo-id="'+tempId+'"]',
      appWidth = document.querySelector('[data-app-width]'),
      node = document.querySelector(selector),
      html = node.innerHTML;
  node.dataset.idType = 'const';
  node.dataset.mongoId = id;
  //  Then update for other clients as changes may have occured meanwhile
  switch (type) {
    //  Articles
    case 'article':
      Sigma.socket.emit(Sigma.getChannelId, { action: 'update', mongoId: id, html: html, owner: Sigma.username });
      break;
    //  Images
    case 'image':
      node.src = Sigma.host+':'+Sigma.port+'/data/'+id+'/'+appWidth.dataset.appWidth;
      break;
  }
};