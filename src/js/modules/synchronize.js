//  Sigma.synchronize module

//  Sync process
module.exports = function () {
  //  Look at active element
  var article = document.activeElement.parentNode,
      isArticleNode = article.nodeName === 'ARTICLE',
      isArticleInDataset = article.dataset.structure === 'article';
  //  Only synchronize with valid articles
  if (isArticleNode && isArticleInDataset) {
    var articleClone = article.cloneNode(true),
        articleFragment = document.createDocumentFragment(),
        mongoId,
        tools,
        articleHTML,
        images,
        makeImagesNeutral = function (i) {
          //  Reset image's source
          images[i].removeAttribute('src');
          //  Remove responsive data
          images[i].removeAttribute('data-image-width');
        },
        makeReadOnly = function (j) {
          //  Make all Sigma attributes with contenteditable set to false
          editableElements[j].contentEditable = 'false';
        };
    //  Inject article into empty clone
    articleFragment.appendChild(articleClone);
    //  Select tools into the clone
    tools = articleFragment.querySelector('.tools');
    //  Then remove it if present
    if ( tools !== null) {
      tools.parentNode.removeChild(tools);
    }
    //  Make responsives images neutral
    images = articleFragment.querySelectorAll('[data-image-width]');
    for (var i = 0; i < images.length; ++i) {
      makeImagesNeutral(i);
    }
    //  Make contenteditable set to false
    editableElements = articleFragment.querySelectorAll('[data-sigma]');
    for (var j = 0; j < editableElements.length; ++j) {
      makeReadOnly(j);
    }
    //  Convert it
    articleHTML = articleFragment.querySelector('[data-structure="article"]').innerHTML;
    //  Process it
    if (document.hasFocus()) {
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
  }
};