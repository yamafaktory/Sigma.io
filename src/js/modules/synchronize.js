//  Sigma.synchronize module

//  Sync process
module.exports = function (node) {
  //  Look at active element or given node as target
  var article = node === undefined ? document.activeElement.parentNode : node,
      isArticleNode = article.nodeName === 'ARTICLE',
      isArticleInDataset = article.dataset.structure === 'article';
  //  Only synchronize with valid articles
  if (isArticleNode && isArticleInDataset) {
    var articleClone = article.cloneNode(true),
        articleFragment = document.createDocumentFragment(),
        mongoId,
        date,
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
      //  Check if article has a mongo id attribute
      if (article.hasAttribute('data-mongo-id')) {
        //  If article has already been saved
        if (article.dataset.idType === 'const') {
          //  Id is from mongoDB
          mongoId = article.dataset.mongoId;
          //  Get date from client
          date = article.querySelector('time').getAttribute('datetime');
          //  Send to server
          Sigma.socket.emit(Sigma.getChannelId, { action: 'update', mongoId: mongoId, html: articleHTML, owner: Sigma.username, date: date });
        }
        //  If id is temporary modifications are managed by changeId module
      } else {
        //  Set attribute as temporary
        article.dataset.idType = 'tmp';
        //  Get a temporary id
        mongoId = Sigma.getTempId();
        //  Store it in mongoId attribute
        article.dataset.mongoId = mongoId;
        //  Get date from client
        date = article.querySelector('time').getAttribute('datetime');
        //  Send to server
        Sigma.socket.emit(Sigma.getChannelId, { action: 'create', mongoId: mongoId, html: articleHTML, owner: Sigma.username, date: date });
      }
      //  Add save state for the article
      Sigma.saveManager.add(mongoId, false);
    }
  }
};