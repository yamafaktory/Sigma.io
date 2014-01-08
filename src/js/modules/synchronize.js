//  Sigma.synchronize module

//  Sync process
module.exports = function () {
  var article = document.activeElement.parentNode,
      articleClone = article.cloneNode(true),
      articleFragment = document.createDocumentFragment(),
      preventWholeHtmlInjection = article.nodeName !== 'HTML',
      mongoId,
      tools,
      articleHTML,
      images,
      makeNeutral = function (i) {
        //  Reset image's source
        images[i].removeAttribute('src');
        //  Remove responsive data
        images[i].removeAttribute('[data-image-width]');
      };
  //  Inject article into empty clone
  articleFragment.appendChild(articleClone);
  //  Select tools into the clone
  tools = articleFragment.querySelector('.tools');
  //  Then remove it if present
  if ( tools !== null) {
    tools.parentNode.removeChild(tools);
  }
  //  Convert it
  articleHTML = articleFragment.querySelector('[data-structure="article"]').innerHTML;
  //  Make responsives images neutral
  images = articleFragment.querySelectorAll('[data-image-width]');
  for (var i = 0; i < images.length; ++i) {
    makeNeutral(i);
  }
  if (document.hasFocus() && preventWholeHtmlInjection) {
    //  Check if div has a mongo id attribute => update content
    if (article.hasAttribute('data-mongo-id')) {
      if (article.dataset.idType === 'const') {
        //  Id is from mongo
        mongoId = article.dataset.mongoId;
        Sigma.socket.emit(Sigma.getChannelId, { action: 'update', mongoId: mongoId, html: articleHTML, owner: Sigma.username });
      } else {
        //  Id is a temporary one

        //  !!!!!!!!!!!!!!!!!!!!

        console.log('berp');
      }
    } else {
      //  Create new content
      article.dataset.idType = 'tmp';
      mongoId = Sigma.getTempId();
      article.dataset.mongoId = mongoId;
      Sigma.socket.emit(Sigma.getChannelId, { action: 'create', mongoId: mongoId, html: articleHTML, owner: Sigma.username });
    }
    //  Add save state for the article
    Sigma.saveManager.add(mongoId, false);
  }
};