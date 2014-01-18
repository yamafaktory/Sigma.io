//  Sigma.contentEditing module

//  Add features for content editing
module.exports = {
  eraseIt : function (event) {
    var target = Sigma.contentEditing.target.current,
        mongoId = target.dataset.mongoId;
    target.parentNode.removeChild(target);
    //  Delete in mongoDB
    Sigma.socket.emit(Sigma.getChannelId, { action: 'delete', mongoId: mongoId });
  },
  addTools : function (event) {
    //  Create tools panel
    var _this = Sigma.contentEditing,
        toolsPanel = document.createElement('div'),
        close = document.createElement('a'),
        erase = document.createElement('a'),
        article = _this.setArticle(event.target);
    toolsPanel.setAttribute('class', 'tools');
    close.setAttribute('class', 'close');
    close.setAttribute('href', '#');
    close.setAttribute('data-tooltip', 'close');
    erase.setAttribute('class', 'erase');
    erase.setAttribute('href', '#');
    erase.setAttribute('data-tooltip', 'erase');
    article.appendChild(toolsPanel);
    toolsPanel.appendChild(close);
    toolsPanel.appendChild(erase);
    //  Attach eventListeners
    Sigma.clickAndTouchListener.add(close, 'removeTools', _this.removeTools);
    Sigma.clickAndTouchListener.add(erase, 'eraseIt', _this.eraseIt);
    //  Store target as former target for further use
    _this.formerTarget = event.target.parentNode;
  },
  manageTools : function (event) {
    var _this = Sigma.contentEditing,
        tools = document.querySelector('.tools');
    if (tools === null) {
      _this.addTools(event);
    } else {
      //  Locate the article in which tools are visible
      var article = _this.setArticle(tools);
      //  Then check if it's the same target
      if (_this.target.current !== article) {
        tools.parentNode.removeChild(tools);
        _this.addTools(event);
      }
      //  Remove eventListener then add it to the new target
      var erase = document.querySelector('.erase');
      Sigma.clickAndTouchListener.remove(erase, 'eraseIt');
      Sigma.clickAndTouchListener.add(erase, 'eraseIt', _this.eraseIt);
    }
  },
  removeTools : function () {
    var tools = document.querySelector('.tools');
    tools.parentNode.removeChild(tools);
  },
  setArticle : function (element) {
    //  Set article considering the fact that the browser can add divs in contenteditable elements
    var article;
    if (element.parentNode.dataset.structure !== 'article') {
      article = element.parentNode.parentNode;
    } else {
      article = element.parentNode;
    }
    return article;
  },
  editMode : function (event) {
    var target = event.target.parentNode;
    target.classList.toggle('editMode');
    //  Store target
    Sigma.contentEditing.target.add = target;
  },
  viewMode : function (event) {
    var target = event.target.parentNode;
    target.classList.remove('editMode');
    //  Update time
    target.querySelector('time').setAttribute('datetime', Sigma.date.html());
    target.querySelector('time').innerText = Sigma.date.now();
    //  Finally delete removed images by user
    Sigma.droppedImages.delete();
  },
  status : function (target, add) {
    var _this = this;
    //  Set add argument to be true by default
    add = add === undefined ? true : add;
    console.log(add);
    if (add) {
      console.log('add');
      console.log(target);
      //  Highlight articles with an edit icon - with firefox hack -
      target.addEventListener('focus', this.editMode, true);
      target.addEventListener('blur', this.viewMode, true);
      //  Add event listener
      Sigma.clickAndTouchListener.add(target, 'manageTools', _this.manageTools, true);
    } else {
      console.log('remove');
      console.log(target);
      //  Remove listeners
      target.removeEventListener('focus', this.editMode, true);
      target.removeEventListener('blur', this.viewMode, true);
      Sigma.clickAndTouchListener.remove(target, 'manageTools');
    }
  },
  target : {
    //  Targets are managed as an array, with current and former values
    history : [],
    set add (target) {
      this.history.push(target);
      //  Limit array size to 2 elements
      if (this.history.length > 2){
        this.history.shift();
      }
    },
    get add () {},
    get current () {
      return this.history[this.history.length - 1];
    },
    get former () {
      if (this.history.length === 2) {
        return this.history[0];
      } else {
        return null;
      }
    }
  }
};