//  Sigma.addContent module

//  New content generator
module.exports = function (html, id, title, content, owner, editable) {
  var main = document.querySelector('main'),
      firstRow = main.querySelector('.row:first-child'),
      cellsInFirstRow = firstRow !== null ? firstRow.children.length : 0,
      newArticle = document.createElement('article');
  newArticle.setAttribute('data-structure', 'article');
  newArticle.setAttribute('class', 'cell');
  //  Create article from scratch or inject content from database
  if (!html) {
    //  Create new h1 for title
    var newTitle = document.createElement('h1');
    newTitle.setAttribute('data-sigma', 'title');
    newTitle.setAttribute('contenteditable', editable);
    newTitle.appendChild(document.createTextNode(title));
    //  Create new h2 for user
    var newOwner = document.createElement('h2');
    newOwner.setAttribute('data-owner', owner);
    newOwner.appendChild(document.createTextNode(owner));
    //  Create new date
    var newDate = document.createElement('time');
    newDate.appendChild(document.createTextNode(Sigma.date.now()));
    newDate.setAttribute('datetime', Sigma.date.html());
    //  Create new p for content
    var newContent = document.createElement('article');
    newContent.setAttribute('data-sigma', 'content');
    newContent.setAttribute('contenteditable', editable);
    newContent.appendChild(document.createTextNode(content));
    //  Append childs in article
    newArticle.appendChild(newTitle);
    newArticle.appendChild(newOwner);
    newArticle.appendChild(newDate);
    newArticle.appendChild(newContent);
  } else {
    //  Assign id
    newArticle.dataset.idType = 'const';
    newArticle.dataset.mongoId = id;
    //  Inject content
    newArticle.innerHTML = html;
  }
  //  Add article to a new row or to the first one
  if (cellsInFirstRow === 0 || cellsInFirstRow === 3) {
    //  Add new row
    var newRow = document.createElement('div');
    newRow.setAttribute('class', 'row');
    main.insertBefore(newRow, main.firstChild);
    //  Then add new article
    newRow.appendChild(newArticle);
  } else {
    firstRow.insertBefore(newArticle, firstRow.firstChild);
  }
};