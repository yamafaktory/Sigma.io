//  Sigma.addContent module

//  New content generator
module.exports = function (reverse, html, id, title, content, owner, editable) {
  var main = document.querySelector('main'),
      firstRow = main.querySelector('.row:first-child'),
      lastRow = main.querySelector('.row:last-child'),
      cellsInFirstRow = firstRow !== null ? firstRow.children.length : 0,
      cellsInLastRow = lastRow !== null ? lastRow.children.length : 0,
      newRow = document.createElement('div'),
      newArticle = document.createElement('article');
  //  Reverse and html are set to false by default
  reverse = reverse === undefined ? false : reverse;
  html = html === undefined ? false : html;
  newRow.setAttribute('class', 'row');
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
    newDate.appendChild(document.createTextNode(Sigma.date.forHuman()));
    newDate.setAttribute('datetime', Sigma.date.forDOM());
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
    //  Get date node and datetime attribute
    var date = newArticle.querySelector('time'),
        datetime = date.getAttribute('datetime');
    date.innerHTML = Sigma.date.forHuman(datetime);
  }
  //  Then add article depending on reverse state
  if (!reverse) {
    //  Add article to a new row or to the first one
    if (cellsInFirstRow === 0 || cellsInFirstRow === 3) {
      main.insertBefore(newRow, main.firstChild);
      //  Then add new article
      newRow.appendChild(newArticle);
    } else {
      firstRow.insertBefore(newArticle, firstRow.firstChild);
    }
  } else {
    //  In this case, article is added on bottom - with getMoreHistory module
    if (cellsInLastRow === 0 || cellsInLastRow === 3) {
      main.appendChild(newRow);
      //  Then add new article
      newRow.appendChild(newArticle);
    } else {
      lastRow.appendChild(newArticle);
    }
  }
};